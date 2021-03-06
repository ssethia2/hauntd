import {
  VuexModule, Module, Mutation, Action, getModule,
} from 'vuex-module-decorators';
import { IAppState } from './IAppState';
import store from '@/store';
import Place from '@/types/Place';
import httpClient from '@/services/api';

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
    public places : Place[] = [];

    public loggedIn: boolean = false;

    public email: string = '';

    public filterOptions: any = {
      findNear: 0,
      createdBy: '',
      location: {
        latitude: -1,
        longitude: -1,
      },
    };

    @Mutation
    public SignIn(user: any) {
      httpClient.defaults.headers["Authorization"] = user.token.split(',')[0]; //eslint-disable-line
      localStorage.setItem('idToken', user.token);
      localStorage.setItem('email', user.email);
      this.email = user.email;
      this.loggedIn = true;
    }

    @Mutation
    public SignOut() {
      delete httpClient.defaults.headers["Authorization"]; //eslint-disable-line
      localStorage.clear();
      this.loggedIn = false;
      this.email = '';
    }

    @Mutation
    private SET_PLACES(places: Place[]) {
      this.places = places;
    }

    @Action
    public SearchPlaces(query: string) {
      const options: any = this.filterOptions;
      options.query = query;
      httpClient.get('/place/', { params: options })
        .then((response) => {
          const places: Place[] = [];
          response.data.forEach((place: any) => {
            places.push({
              userName: place.user_name,
              placeId: place.place_id,
              email: place.email,
              placeName: place.place_name,
              address: place.address,
              latitude: place.latitude,
              longitude: place.longitude,
              avgRating: place.avg_rating,
              description: place.description,
            });
          });
          this.SET_PLACES(places);
          this.filterOptions.createdBy = '';
        })
        .catch((e) => {
          this.SignOut();
          this.SET_PLACES([]);
        });
    }

    @Action
    public ClearPlaces() {
      this.SET_PLACES([]);
    }

    @Mutation
    public updateFilterOptions(update: any) {
      Object.keys(update).forEach((k) => {
        this.filterOptions[k] = update[k];
      });
    }

    @Action
    public FilterSort() {

    }
}

export default getModule(App);
