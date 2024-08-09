class DuckApi{
    constructor(){
        this.baseUrl = "https://express-proxy-3fa2dcca9dad.herokuapp.com/api?url=https://random-d.uk/api/v2";
    }

    async getDuckImage(){
        try{
            const {data} = await axios.get(`${this.baseUrl}/random`);
            return data.url;
        }catch(err){
            console.log("unable to load the image", err);
        }
    }

}

export default DuckApi;
