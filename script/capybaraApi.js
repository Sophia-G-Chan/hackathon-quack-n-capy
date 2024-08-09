class CapybaraApi {
    constructor () {
        this.baseUrl = "https://api.capy.lol/v1/";
    }

    async getCapybaraImg () {
        try {
            const {data} = await axios.get(`${this.baseUrl}capybara?json=true`);
            return data.data.url;
        } catch {
            console.error(`unable to get image of a capybara 🙁`);
        }
    }

    async getCapybaraFact () {
        const {data} = await axios.get(`${this.baseUrl}facts`);
        return data.data[Math.floor(Math.random()*25)];
    }
}

export default CapybaraApi;
