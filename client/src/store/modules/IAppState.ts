import Place from '@/types/Place';

export interface IAppState {
    places: Place[],
    loggedIn: boolean,
    email: string,
    filterOptions: any,
}