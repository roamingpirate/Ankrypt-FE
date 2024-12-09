import { TextureLoader } from "three";

export const loadTextures = async (urls) => {
    const loader = new TextureLoader();
    const loadTexture = (url) => {
        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (texture) => resolve(texture), 
                undefined, 
                (err) => reject(err) 
            );
        });
    };
    const textures = await Promise.all(urls.map(url => loadTexture(url)));
    return textures;  
}