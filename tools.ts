export const fetch_new_inventory = async (steamId:string,steam_api_key:string,appId:any) => {
    try {
        const rotated_url = `https://markt.tf/inventory/${steamId}/${steam_api_key}/${appId}`;
        const response = await fetch(rotated_url);
        
        const restext = await response.json();
        const data = JSON.parse(restext);

        const descriptions = data.response.descriptions;
        const assets = data.response.assets;

        let descriptions_pool:any = [];

        assets.forEach((asset: any, assetInd: any) => {
            descriptions.forEach((desc: any, descInd: any) => {
                if (asset.classid === desc.classid && asset.instanceid === desc.instanceid && desc.tradable) {
                    const objectWithAssetId = { ...desc, assetid: asset.assetid };
                    descriptions_pool.push(objectWithAssetId);
                }
            });
        });


        return descriptions_pool

    } catch (error) {
        return null
    } 
}