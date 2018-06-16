const querystring = require('querystring');
const axios = require('axios');

let api = {};

api.getTimecards = async (settings, token) => {

    let auth = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    let url = api.generateUrlTimecards(settings);

    const response = await axios.get(url, auth);
    return response.data.value;
};

api.generateUrlTimecards = (settings) => {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(Date.UTC(y, m, 1));
    let lastDay = new Date(Date.UTC(y, m + 1, 0));

    let filter = `((Worker/Id eq ${settings.auth.id}) and (Date ge datetime'${firstDay.toISOString()}')) and (Date le datetime'${lastDay.toISOString()}')`;

    let url = `${settings.constant.baseUrlTimecard}/odata/TimecardEntries?$filter=${filter}`;

    let requestSettings = "&$orderby=Date&$expand=Activity,Order,Worker&$inlinecount=allpages";

    return url + requestSettings;
};

api.getToken = async settings => {

    const requestParams = {
        grant_type: 'password',
        username: settings.auth.username,
        password: settings.auth.password,
        client_id: 'TimecardNgApp'
    };

    const response = await axios.post(`${settings.constant.baseUrlTimecard}/token`, querystring.stringify(requestParams));
    return response.data.access_token;
};

module.exports = api;