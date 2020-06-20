import { argv } from 'process';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function (...message: any): void {
    if (!argv.includes('--no-console')) {
        const date = new Date();

        let hour: string | number = date.getHours();
        let minute: string | number = date.getMinutes();
        let second: string | number = date.getSeconds();

        if (hour < 10) {
            hour = `0${hour}`;
        }
        if (minute < 10) {
            minute = `0${minute}`;
        }
        if (second < 10) {
            second = `0${second}`;
        }

        console.log(`${`[${hour}:${minute}:${second}]`.grey}`, ...message);
    }
}
