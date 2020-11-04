import ajax from './ajax';

export default async (route, data) => {
    return ajax.post(route, data);
};