import axios from 'axios';
import * as Constants from "../constants"

export async function makePostRequest(tableName: string, params: string): Promise<any | null> {
    console.log(tableName)
    console.log(params)
    try {
        const article = { title: "React POST Request Example" };

        const headers = {
            Authorization: "Bearer mytoken",
            accept: "application/json",
        };
        const response = await axios.post(Constants.api_gateway_host + tableName + params, article,{
            headers
        });

        if (response.status === 200) {
            console.log("Post success")
        }
        return;
    } catch (error) {
        console.error(`Error making request to ${tableName}: ${error.message}`);
        return null;
    }
}



// makePostRequest(urlExample, urlExample)
//     .then(response => {
//         if (response) {
//             console.log('Response:', response);
//         }
//     })
//     .catch(error => console.error('Error:', error));
