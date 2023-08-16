// eslint-disable-next-line import/no-anonymous-default-export
export default {
    
    async sendApiRequest(url, method, setauth, body) {
        const requestOptions = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        };
        if (method === "DELETE") {
            // delete requestOptions.body;
        }
        if (method === "GET") {
            delete requestOptions.body;
        }

        if (setauth === true) {
            let token = localStorage.getItem("token")
                ? localStorage.getItem("token")
                : "no-token";
            requestOptions.headers["Authorization"] = "Bearer " + token;
        }

        try {
            const response = await fetch(
                process.env.REACT_APP_API_BASEURL + url,
                requestOptions
            );
            let body = await response.text();
            if (response.status !== 200) {
                throw body;
            }
            const data = body.includes("{") ? JSON.parse(body) : body;
            return data;
        } catch (e) {
            throw e;
        }
    },

    async dataUrlToFile(url, fileName) {
        const [mediaType, data] = url.split(",");

        const mime = mediaType.match(/:(.*?);/)?.[0];
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        return new File([buffer], fileName, { type: mime });
    }
}
