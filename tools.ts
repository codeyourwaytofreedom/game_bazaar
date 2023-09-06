export const fetch_new_inventory = async (steamId:string,steam_api_key:string,appId:number) => {
    try {
        const rotated_url = `https://markt.tf/inventory/${steamId}/${steam_api_key}/${appId}`;
        const response = await fetch(rotated_url);
        
        const restext = await response.json();
        const data = JSON.parse(restext);

        const descriptions = data.response.descriptions;
        const assets = data.response.assets;

        assets.forEach((asset:any,assetInd:any) => {
            descriptions.forEach((desc:any, descInd:any) => {
                //console.log(asset.classid === desc.classid, asset.instanceid === desc.instanceid);
                if(asset.classid === desc.classid && asset.instanceid === desc.instanceid){
                    descriptions[descInd].assetid = asset.assetid
                }
            });
        });
        return descriptions

    } catch (error) {
        return null
    } 
}