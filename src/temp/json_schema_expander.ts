interface Dictionary<T> {
    [Key: string]: T;
}

export interface ValidateObjectResult {
    object: Dictionary<any>;
    isModified: boolean;
}

export class JSONSchemaExpander {
    state: Dictionary<any>;
    primary_dataframe: string;
    values: Dictionary<string>;
    contains_macros: boolean;
    spec: Dictionary<any>;
    valid_options: Dictionary<any>;

    constructor(state: Dictionary<any>) {
        this.state = state;
        this.primary_dataframe = '';
        this.values = {};
        this.contains_macros = false;
        this.spec = {
            dataframes: [],
            datasets: [],
            metadata: [],
            models: [],
            outputs: []
        };
        this.valid_options = {};
    }

    expand_object(object: Dictionary<any>, primary_dataframe?: string, values?: Dictionary<string>) {
        // init values
        if (primary_dataframe !== undefined) this.primary_dataframe = primary_dataframe;
        if (values !== undefined) this.values = values;

        // exec logic
        let context = { dataframes: {}, datasets: {}, dependencies: {} };
        let parents: any[] = [];
        let expanded_object = this.__expand_object(object, context, parents);

        // reset values
        this.primary_dataframe = '';
        this.values = {};
        return expanded_object;
    }

    validate_object(object: Dictionary<any>): ValidateObjectResult {
        let parents: any[] = [];
        let hasChanged = { isModified: false };
        let result = this.filter_empties(this.__validate_object(object, parents, hasChanged));
        return { isModified: hasChanged.isModified, object: result };
    }

    filter_empties(object: any) {
        if (object == null) return object;

        if (Array.isArray(object)) {
            for (let v of deepCopy(object)) {
                let filter_v = this.filter_empties(v);
                if (filter_v == null) {
                    const index = object.indexOf(v, 0);
                    if (index > -1) {
                        object.splice(index, 1);
                    }
                }
            }
            if (object.length === 0) {
                object = null;
            }
        } else if (typeof object == 'object') {
            for (let k of Object.keys(deepCopy(object))) {
                let v = object[k];
                let filter_v = this.filter_empties(v);
                if (filter_v == null) {
                    delete object[k];
                }
            }
            if (Object.keys(object).length === 0) {
                object = null;
            }
        }
        return object;
    }

    // Internal functions
    // ------------------------------------------------------------------------

    __get_full_path(parents: Array<string>) {
        return '/' + parents.join('/');
    }

    __parents_in(parents: Array<string>, options: Array<string>) {
        return options.some((r) => parents.includes(r));
    }

    __get_item_id(parents: Array<string>) {
        let regex_path = '/';
        parents.forEach((prnt) => {
            if (prnt === 'properties') return;
            else if (['items', 'additionalProperties'].includes(prnt)) regex_path += '.\\d*/';
            else regex_path += prnt + '/';
        });

        return regex_path;
    }

    __get_property_title(property: Dictionary<string>, parents: Array<string>) {
        if ('title' in property) return property['title'];
        else {
            let title = parents[parents.length - 1];
            return title.charAt(0).toUpperCase() + title.slice(1);
        }
    }

    __is_property_required(parents: Array<string>, parent_obj: Dictionary<any>) {
        if (!('required' in parent_obj)) return false;

        let prop_id = parents[parents.length - 1];
        return parent_obj['required'].includes(prop_id);
    }

    __expand_object(object: Dictionary<any>, context: Dictionary<any>, parents: Array<string>) {
        if (!('properties' in object) && (!('additionalProperties' in object) || typeof object['additionalProperties'] != 'object'))
            throw new Error('Invalid schema: no properties nor additionalProperties (path=' + this.__get_full_path(parents) + ')');

        let expanded_object = deepCopy(object);

        for (let field_type of ['properties', 'dependencies']) {
            if (!(field_type in object)) continue;

            let properties_parents = deepCopy(parents);
            properties_parents.push(field_type);
            let mypath = this.__get_full_path(properties_parents);
            let expanded_properties: any = {};

            // Parse the properties
            for (let property_name of Object.keys(object[field_type])) {
                let property_info = object[field_type][property_name];
                if (typeof property_info != 'object') throw new Error('Invalid schema: property is not an object (path=' + mypath + ')');

                let expanded_property: any = {};
                let property_parents = deepCopy(properties_parents);
                property_parents.push(property_name);

                if ('oneOf' in property_info) {
                    // This is a oneOf object
                    if ('type' in property_info && property_info['type'] === 'string') expanded_property = property_info;
                    else {
                        expanded_property['oneOf'] = [];
                        for (let oneof_option of property_info['oneOf']) {
                            // Define the type
                            let oneof_option_type: any = null;
                            if ('type' in oneof_option) oneof_option_type = oneof_option['type'];
                            else if ('properties' in oneof_option) oneof_option_type = 'object';

                            let oneof_parents = deepCopy(property_parents);
                            if (oneof_option_type === 'object') expanded_property['oneOf'].push(this.__expand_object(oneof_option, context, oneof_parents));
                            else if (oneof_option_type === 'array') expanded_property['oneOf'].push(this.__expand_array(oneof_option, context, oneof_parents));
                            else expanded_property['oneOf'].push(this.__expand_property(oneof_option, context, oneof_parents, object));
                        }
                    }
                } else {
                    // This is a regular object
                    // Define the type
                    let property_type: any = null;
                    if ('type' in property_info) property_type = property_info['type'];
                    else if ('properties' in property_info) property_type = 'object';

                    if (property_type === 'object') expanded_property = this.__expand_object(property_info, context, property_parents);
                    else if (property_type === 'array') expanded_property = this.__expand_array(property_info, context, property_parents);
                    else expanded_property = this.__expand_property(property_info, context, property_parents, object);

                    if (expanded_property == null) continue;
                }

                expanded_properties[property_name] = expanded_property;
            }

            expanded_object[field_type] = expanded_properties;
        }

        if ('additionalProperties' in object && typeof object['additionalProperties'] == 'object') {
            let additional_prop_parents = deepCopy(parents);
            additional_prop_parents.push('additionalProperties');
            expanded_object['additionalProperties'] = this.__expand_object(object['additionalProperties'], context, additional_prop_parents);
        }

        return expanded_object;
    }

    __expand_array(array_data: any, context: Dictionary<any>, parents: Array<string>) {
        if (!('items' in array_data)) throw new Error('Invalid schema: no items (path=' + this.__get_full_path(parents) + ')');

        parents.push('items');
        let expanded_items: any = {};

        if ('oneOf' in array_data['items']) {
            // This is a oneOf object
            expanded_items['oneOf'] = [];
            for (let oneof_option of array_data['items']['oneOf']) {
                // Define the type
                let oneof_option_type: any = null;
                if ('type' in oneof_option) oneof_option_type = oneof_option['type'];
                else if ('properties' in oneof_option) oneof_option_type = 'object';

                let oneof_parents = deepCopy(parents);
                if (oneof_option_type === 'object') expanded_items['oneOf'].push(this.__expand_object(oneof_option, context, oneof_parents));
                else if (oneof_option_type === 'array') expanded_items['oneOf'].push(this.__expand_array(oneof_option, context, oneof_parents));
                else expanded_items['oneOf'].push(this.__expand_property(oneof_option, context, oneof_parents, array_data));
            }
        } else {
            if (!('type' in array_data['items'])) throw new Error('Invalid schema: items without type (path=' + this.__get_full_path(parents) + ')');

            if (array_data['items']['type'] === 'object') {
                // parents.push(property_name)
                expanded_items = this.__expand_object(array_data['items'], context, parents);
            } else if (array_data['items']['type'] === 'array') {
                expanded_items = this.__expand_array(array_data['items'], context, parents);
            } else {
                expanded_items = this.__expand_property(array_data['items'], context, parents, array_data);
            }
        }

        if (expanded_items == null) return null;

        let expanded_array = deepCopy(array_data);
        expanded_array['items'] = expanded_items;
        return expanded_array;
    }

    __expand_property(property: Dictionary<any>, context: Dictionary<any>, parents: Array<string>, parent_obj: Dictionary<any>) {
        let mypath = this.__get_full_path(parents);
        let expanded_property = deepCopy(property);

        // Check for macros
        if ('__SELECT_DATAFRAME__' in property) {
            this.contains_macros = true;

            let ref_name = property['__SELECT_DATAFRAME__'];
            if (this.__parents_in(parents, ['additionalProperties', 'items', 'dependencies']))
                throw new Error('Invalid schema: referencing dataframe=' + ref_name + ' from within a dynamic structure is not supported (path=' + mypath + ')');
            if (ref_name in context['dataframes']) throw new Error('Invalid schema: duplicate dataframe=' + ref_name + ' (path=' + mypath + ')');

            // calculate input ID
            let input_id = this.__get_item_id(parents);

            // save the reference to this dataframe
            context['dataframes'][ref_name] = parents;

            // expand the macro
            delete expanded_property['__SELECT_DATAFRAME__'];
            expanded_property['oneOf'] = [];

            if (input_id in this.values) {
                let selected_value = this.values[input_id];
                let add_option = true;
                for (let oneof of expanded_property['oneOf']) {
                    if (oneof['const'] === selected_value) {
                        add_option = false;
                        break;
                    }
                }

                if (add_option) {
                    expanded_property['oneOf'].push({
                        const: selected_value,
                        title: this.state['dataframes'][selected_value]['name']
                    });
                }
                expanded_property['default'] = selected_value;
            }

            if (expanded_property['oneOf'].length === 0) {
                expanded_property['oneOf'].push({
                    const: ''
                });
                expanded_property['default'] = '';
            }

            // Update the valid options
            this.valid_options[input_id] = {
                type: 'DATAFRAME',
                values: expanded_property['oneOf'].map((v: any) => {
                    return v['const'];
                })
            };

            // Update spec
            this.spec['dataframes'].push({
                id: input_id,
                name: this.__get_property_title(property, parents),
                is_required: this.__is_property_required(parents, parent_obj)
            });
        } else if ('__SELECT_COLUMN__' in property) {
            this.contains_macros = true;

            let column_list: string[] = [];

            if (typeof property['__SELECT_COLUMN__'] == 'object') {
                if (!('action' in property['__SELECT_COLUMN__'])) throw new Error('Invalid __SELECT_COLUMN__ tag, undefined action (path=' + mypath + ')');
                if (!('dataframes' in property['__SELECT_COLUMN__'])) throw new Error('Invalid __SELECT_COLUMN__ tag, undefined dataframes (path=' + mypath + ')');
                if (!Array.isArray(property['__SELECT_COLUMN__']['dataframes'])) throw new Error('Invalid __SELECT_COLUMN__ tag, invalid dataframes (path=' + mypath + ')');

                let column_set = new Set<string>();
                for (let df_name of property['__SELECT_COLUMN__']['dataframes']) {
                    let cols = [];
                    if (df_name === '__PARENT_DATAFRAME__' || df_name === '__PARENT_DF__') {
                        if (this.state != null && this.primary_dataframe in this.state['dataframes']) cols = this.state['dataframes'][this.primary_dataframe]['cols'];
                    } else {
                        let parent_input_id = this.__get_item_id(context['dataframes'][df_name]);
                        if (parent_input_id in this.values) {
                            let parent_dataframe = this.values[parent_input_id];
                            if (this.state != null && parent_dataframe in this.state['dataframes']) cols = this.state['dataframes'][parent_dataframe]['cols'];
                        }
                    }

                    if (cols.length > 0) {
                        let cols_set = new Set<any>(cols);
                        if (column_set.size === 0) {
                            column_set = cols_set;
                        } else {
                            if (property['__SELECT_COLUMN__']['action'] === 'intersection') {
                                // intersection
                                // column_set = new Set([...column_set].filter((x) => cols_set.has(x)));
                            } else if (property['__SELECT_COLUMN__']['action'] === 'difference') {
                                // difference
                                // column_set = new Set([...column_set].filter((x) => !cols_set.has(x)));
                            } else {
                                // union
                                // column_set = new Set([...column_set, ...cols_set]);
                            }
                        }
                    }
                }

                if (column_set.size > 0) column_list = Array.from(column_set.values());
            } else if (typeof property['__SELECT_COLUMN__'] == 'string') {
                let ref_name = property['__SELECT_COLUMN__'];
                if (ref_name === '__PARENT_DATAFRAME__' || ref_name === '__PARENT_DF__') {
                    // Display the columns of the parent dataframe
                    if (this.state != null && this.primary_dataframe in this.state['dataframes']) column_list = this.state['dataframes'][this.primary_dataframe]['cols'];
                } else {
                    // Display columns of a previously selected dataframe
                    if (!(ref_name in context['dataframes'])) throw new Error('Invalid schema: unkown reference to dataframe=' + ref_name + ' (path=' + mypath + ')');

                    let parent_input_id = this.__get_item_id(context['dataframes'][ref_name]);
                    if (parent_input_id in this.values) {
                        let parent_dataframe = this.values[parent_input_id];
                        if (this.state != null && parent_dataframe in this.state['dataframes']) column_list = this.state['dataframes'][parent_dataframe]['cols'];
                    }
                }
            } else {
                throw new Error('Invalid __SELECT_COLUMN__ tag (path=' + mypath + ')');
            }

            // expand the macro
            delete expanded_property['__SELECT_COLUMN__'];
            expanded_property['type'] = 'string';
            if (column_list.length > 0) expanded_property['enum'] = column_list;
            else {
                expanded_property['enum'] = [''];
                expanded_property['default'] = '';
                if ('minItems' in parent_obj) delete parent_obj['minItems'];
            }

            // Update the valid options
            let input_id = this.__get_item_id(parents);
            this.valid_options[input_id] = {
                type: 'COLUMN',
                values: expanded_property['enum']
            };
        } else if ('__SELECT_DATASET__' in property) {
            this.contains_macros = true;

            let ref_name = property['__SELECT_DATASET__'];
            if (this.__parents_in(parents, ['additionalProperties', 'items', 'dependencies']))
                throw new Error('Invalid schema: referencing a dataset from within a dynamic structure is not supported (path=' + mypath + ')');
            if (ref_name in context['datasets']) throw new Error('Invalid schema: duplicate dataset=' + ref_name + ' (path=' + mypath + ')');

            // calculate input ID
            let input_id = this.__get_item_id(parents);

            // save the reference to this dataframe
            context['datasets'][ref_name] = parents;

            // expand the macro
            delete expanded_property['__SELECT_DATASET__'];
            expanded_property['oneOf'] = [];

            if (input_id in this.values) {
                let selected_value = this.values[input_id];
                let add_option = true;
                for (let oneof of expanded_property['oneOf']) {
                    if (oneof['const'] === selected_value) {
                        add_option = false;
                        break;
                    }
                }

                if (add_option) {
                    expanded_property['oneOf'].push({
                        const: selected_value,
                        title: this.state['datasets'][selected_value]['name']
                    });
                }
                expanded_property['default'] = selected_value;
            }

            if (expanded_property['oneOf'].length === 0) {
                expanded_property['oneOf'].push({
                    const: ''
                });
                expanded_property['default'] = '';
            }

            // Update spec
            this.spec['datasets'].push({
                id: input_id,
                name: this.__get_property_title(property, parents),
                is_required: this.__is_property_required(parents, parent_obj)
            });
        } else if ('__SELECT_DATASET_DF_COLUMN__' in property) {
            this.contains_macros = true;

            if (typeof property['__SELECT_DATASET_DF_COLUMN__'] != 'object') throw new Error('Invalid __SELECT_DATASET_DF_COLUMN__ tag (path=' + mypath + ')');
            if (!('dataset' in property['__SELECT_DATASET_DF_COLUMN__'])) throw new Error("Invalid __SELECT_DATASET_DF_COLUMN__ tag, couldn't find dataset param (path=" + mypath + ')');
            if (!('dataframe' in property['__SELECT_DATASET_DF_COLUMN__'])) throw new Error("Invalid __SELECT_DATASET_DF_COLUMN__ tag, couldn't find dataframe param (path=" + mypath + ')');

            let dataset_ref = property['__SELECT_DATASET_DF_COLUMN__']['dataset'];
            if (!(dataset_ref in context['datasets'])) throw new Error('Invalid schema: unkown reference to dataset=' + dataset_ref + ' (path=' + mypath + ')');

            let dataframe_ref = property['__SELECT_DATASET_DF_COLUMN__']['dataframe'];

            let column_list = [];

            let parent_input_id = this.__get_item_id(context['datasets'][dataset_ref]);
            if (parent_input_id in this.values) {
                let parent_dataset = this.values[parent_input_id];
                if (this.state != null && parent_dataset in this.state['datasets'] && dataframe_ref in this.state['datasets'][parent_dataset]['dataframes'])
                    column_list = this.state['datasets'][parent_dataset]['dataframes'][dataframe_ref]['cols'];
            }

            // expand the macro
            delete expanded_property['__SELECT_DATASET_DF_COLUMN__'];
            expanded_property['type'] = 'string';
            if (column_list.length > 0) expanded_property['enum'] = column_list;
            else {
                expanded_property['enum'] = [''];
                expanded_property['default'] = '';
                if ('minItems' in parent_obj) delete parent_obj['minItems'];
            }

            // Update the valid options
            let input_id = this.__get_item_id(parents);
            this.valid_options[input_id] = {
                type: 'COLUMN',
                values: expanded_property['enum']
            };
        } else if ('__SELECT_DATASET_DF__' in property) {
            this.contains_macros = true;

            if (typeof property['__SELECT_DATASET_DF__'] != 'object') throw new Error('Invalid __SELECT_DATASET_DF__ tag (path=' + mypath + ')');
            if (!('dataset' in property['__SELECT_DATASET_DF__'])) throw new Error("Invalid __SELECT_DATASET_DF__ tag, couldn't find dataset param (path=" + mypath + ')');

            let dataset_ref = property['__SELECT_DATASET_DF__']['dataset'];
            if (!(dataset_ref in context['datasets'])) throw new Error('Invalid schema: unknown reference to dataset=' + dataset_ref + ' (path=' + mypath + ')');

            let dataframes_dict: any = {};

            // calculate input ID
            let input_id = this.__get_item_id(parents);

            let parent_input_id = this.__get_item_id(context['datasets'][dataset_ref]);
            if (parent_input_id in this.values) {
                let parent_dataset = this.values[parent_input_id];
                if (this.state != null && parent_dataset in this.state['datasets'] && this.state['datasets'][parent_dataset]['dataframes'] != null) {
                    for (let dataframe_key of Object.keys(this.state['datasets'][parent_dataset]['dataframes'])) {
                        dataframes_dict[dataframe_key] = this.state['datasets'][parent_dataset]['dataframes'][dataframe_key]['name'];
                    }
                }
            }

            // expand the macro
            delete expanded_property['__SELECT_DATASET_DF__'];
            expanded_property['type'] = 'string';
            expanded_property['oneOf'] = [];

            for (let df_const of Object.keys(dataframes_dict)) {
                let df_title = dataframes_dict[df_const];
                expanded_property['oneOf'].push({
                    const: df_const,
                    title: df_title
                });
            }

            if (expanded_property['oneOf'].length === 0) {
                expanded_property['oneOf'].push({
                    const: ''
                });
                expanded_property['default'] = '';
            }

            // Update the valid options
            this.valid_options[input_id] = {
                type: 'DATASET',
                values: expanded_property['oneOf'].map((v: any) => {
                    return v['const'];
                })
            };
        } else if ('__SELECT_MODEL__' in property) {
            this.contains_macros = true;

            if (this.__parents_in(parents, ['additionalProperties', 'items', 'dependencies']))
                throw new Error('Invalid schema: referencing a model from within a dynamic structure is not supported (path=' + mypath + ')');

            // calculate input ID
            let input_id = this.__get_item_id(parents);

            // expand the macro
            delete expanded_property['__SELECT_MODEL__'];
            expanded_property['oneOf'] = [];

            if (input_id in this.values) {
                let selected_value = this.values[input_id];
                let add_option = true;
                for (let oneof of expanded_property['oneOf']) {
                    if (oneof['const'] === selected_value) {
                        add_option = false;
                        break;
                    }
                }

                if (add_option) {
                    expanded_property['oneOf'].push({
                        const: selected_value,
                        title: this.state['models'][selected_value]['name']
                    });
                }
                expanded_property['default'] = selected_value;
            }

            if (expanded_property['oneOf'].length === 0) {
                expanded_property['oneOf'].push({
                    const: ''
                });
                expanded_property['default'] = '';
            }

            // Update spec
            console.log(parents);
            this.spec['models'].push({
                id: input_id,
                name: this.__get_property_title(property, parents),
                is_required: this.__is_property_required(parents, parent_obj)
            });
        } else if ('__OUTPUT_DEFINITION__' in property) {
            this.contains_macros = true;

            if (this.__parents_in(parents, ['additionalProperties', 'items']))
                throw new Error('Invalid schema: referencing a metadata from within a dynamic structure is not supported (path=' + mypath + ')');

            // calculate input ID
            let input_id = this.__get_item_id(parents);
            let output_id = expanded_property['__OUTPUT_DEFINITION__'];

            // Generate repository details
            let repo_objects: Array<any> = [];
            if (this.state != null && 'repositories' in this.state) {
                for (let key of Object.keys(this.state['repositories'])) {
                    let value = this.state['repositories'][key];
                    repo_objects.push({
                        const: key,
                        title: value['name']
                    });
                }
            }
            if (repo_objects.length === 0) {
                repo_objects.push({
                    const: ''
                });
            }

            // expand the macro
            delete expanded_property['__OUTPUT_DEFINITION__'];
            // TODO:
            // For now just treat this as a string field
            expanded_property['type'] = 'string';
            // expanded_property["properties"] = {}
            // expanded_property["properties"] = {
            //     "action": {
            //         "title": "How do you want to store the results",
            //         "type": "string",
            //         "oneOf": [
            //             // {
            //             //     "const": "generate_artifact",
            //             //     "title": "Generate an artifact"
            //             // },
            //             {
            //                 "const": "store_in_repo",
            //                 "title": "Store it in a data repository"
            //             }
            //         ],
            //         // "default": "generate_artifact"
            //         "default": "store_in_repo"
            //     }
            // }
            // expanded_property["dependencies"] = {
            //     "action": {
            //         "oneOf": [
            //             // {
            //             //     "properties": {
            //             //         "action": {
            //             //             "oneOf": [
            //             //                 {
            //             //                     "const": "generate_artifact"
            //             //                 }
            //             //             ]
            //             //         },
            //             //         "artifact_path": {
            //             //             "type": "string",
            //             //             "title": "Artifact path"
            //             //         }
            //             //     },
            //             //     "required": [
            //             //         "artifact_path"
            //             //     ]
            //             // },
            //             {
            //                 "properties": {
            //                     "action": {
            //                         "oneOf": [
            //                             {
            //                                 "const": "store_in_repo"
            //                             }
            //                         ]
            //                     },
            //                     "data_repository": {
            //                         "type": "integer",
            //                         "title": "Data repository",
            //                         "oneOf": repo_objects
            //                     },
            //                     "file_path": {
            //                         "type": "string",
            //                         "title": "Path within the repository"
            //                     }
            //                 },
            //                 "required": [
            //                     "data_repository",
            //                     "file_path"
            //                 ]
            //             }
            //         ]
            //     }
            // }

            // Update spec
            this.spec['outputs'].push({
                id: input_id,
                output_id: output_id
            });
        } else if ('__REPOSITORY_DEFINITION__' in property) {
            this.contains_macros = true;

            // Generate repository details
            let repo_objects: Array<any> = [];
            if (this.state != null && 'repositories' in this.state) {
                for (let key of Object.keys(this.state['repositories'])) {
                    let value = this.state['repositories'][key];
                    repo_objects.push({
                        const: key,
                        title: value['name']
                    });
                }
            }
            if (repo_objects.length === 0) {
                repo_objects.push({
                    const: ''
                });
            }

            // expand the macro
            delete expanded_property['__REPOSITORY_DEFINITION__'];
            expanded_property['type'] = 'integer';
            expanded_property['oneOf'] = repo_objects;
        }

        return expanded_property;
    }

    __validate_object(object: any, parents: Array<string>, status: { isModified: boolean }) {
        let result: any;

        if (Array.isArray(object)) {
            result = [];
            let i = 0;
            for (let array_value of object) {
                let array_parent = deepCopy(parents);
                array_parent.push(i.toString());
                result.push(this.__validate_object(array_value, array_parent, status));
                i += 1;
            }
        } else if (typeof object == 'object') {
            result = {};
            for (let field_name of Object.keys(object)) {
                let field_value = object[field_name];
                let object_parent = deepCopy(parents);
                object_parent.push(field_name);
                result[field_name] = this.__validate_object(field_value, object_parent, status);
            }
        } else {
            result = object;
            let path = this.__get_full_path(parents) + '/';
            for (let input_id of Object.keys(this.valid_options)) {
                let values = this.valid_options[input_id]['values'];
                const rExp: RegExp = new RegExp('^' + input_id + '$');
                if (rExp.test(path)) {
                    if (!values.includes(object)) {
                        status.isModified = this.valid_options[input_id]['type'] === 'COLUMN';
                        return null;
                    }
                }
            }
        }

        return result;
    }
}

// Auxiliary tools
// ----------------------------------------------------------------------------

function deepCopy(obj: any): any {
    var copy: any;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || 'object' != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
