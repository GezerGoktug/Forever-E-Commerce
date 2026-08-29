export { };

declare global {
    interface Window {
        APP_NAME: string,
        ENV: 'development' | 'production'
    }
}