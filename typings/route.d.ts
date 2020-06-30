export interface Route {
    controller: string,
    method?: string,
    middleware?: string[],
    path: string,
}
