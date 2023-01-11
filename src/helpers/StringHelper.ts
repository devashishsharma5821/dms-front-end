import zip from 'lodash/zip';
export class StringHelper {
    static truncate(str: string | undefined, n: number) {
        if (str) {
            if (str.length <= n) return str;
            if (n <= 1) return '…';
            let dot = str.lastIndexOf('.');
            let after = dot < 0 ? 1 : Math.max(1, Math.min(n - 2, str.length - dot + 2));
            let before = n - after - 1;
            return str.slice(0, before) + '…' + str.slice(-after);
        }
    }

    static getSeparatedString(separator: string, ...strings: Array<string>): string {
        return strings.join(separator);
    }

    static singleline(template: TemplateStringsArray, ...args: any[]): string {
        const empty = '';
        const space = ' ';
        return zip(
            template.map((t) => t.replace(/[\r\n]+\s*/gu, space)),
            args
        )
            .flat()
            .join(empty)
            .trim();
    }

    static formatBytes(bytes: number, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}
