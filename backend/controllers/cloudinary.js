const cloudinary = require('cloudinary')
// const { result } = require('lodash')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.upload =  async (req, res) => {
    // // console.log("RESPONSE", req.body.image)
    try{
        let results = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,
            resource_type: 'auto'
        })
        res.json({
            public_id: results.public_id,
            url: results.secure_url
        })
    } catch (err){
        console.log("CLOUDINARY_SERVER_SIDE", err)
    }
}

exports.remove = (req, res) => {
    let image_id = req.body.public_id
    cloudinary.uploader.destroy(image_id, (err, result) => {
        if (err) {
            return res.json({success: false, err})
        }
        res.send('CLOUDINARY_OK')
    })
}