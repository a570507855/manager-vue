import ajax from './ajax';
import {
    getToken
} from './token'

export default (route, data) => {
    return ajax.get(route, {
        data: data,
        params: {
            ...data,
            token: getToken()
        }
    });
};