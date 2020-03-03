const express = require('express');
const router = express.Router();
const Commodity = require('../../models/Commodity');
const passport = require('passport');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');


// $route POST api/commodity/add
// @desc 添加商品信息
// @access private
router.post('/add',(req,res)=>{
    console.log(req.body);
    const newCommodity = new Commodity({
        img:req.body.img,
        name:req.body.name,
        describe:req.body.describe,
        category:req.body.category,
        price:req.body.price,
        onSale:req.body.onSale
    })
    newCommodity.save()
        .then(result=>{
            res.send('商品添加成功！');
        })
        .catch(err=>res.status(400).send('商品添加失败，请重试！'))
})

// $route POST api/commodity/edit
// @desc 修改商品信息
// @access private
router.post('/edit',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const data = req.body;
    Commodity.findOneAndUpdate({_id:data._id},{$set:data},{new:true})
        .then(result=>{
            res.send('商品修改成功！');
        })
        .catch(err=>res.status(400).send('商品修改失败，请重试！'))
})

// $route POST api/commodity/del
// @desc 删除商品信息
// @access private
router.post('/del',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Commodity.findOneAndRemove({_id:req.body._id})
        .then(result=>res.send('删除商品成功！'))
        .catch(err=>res.status(400).send('删除商品失败，请重试！'))
})

// $route get api/commodity/all
// @desc 获取所有商品信息，返回json数据
// @access private
router.get('/all',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Commodity.find()
        .then(result=>{
            if(!result){
                res.json({})
            }else{
                res.json(result)
            }
        })
        .catch(err=>res.status(400).send('获取数据失败，请稍后再试！'))
})

// $route POST api/commodity/upload
// @desc 上传商品照片，返回json数据
// @access private
router.post('/upload',passport.authenticate('jwt',{session:false}),(req,res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => { 
        fs.rename(files.file.path, path.join(__dirname,'../../public/goods', files.file.name), (err) => { 
            if (err) throw err;
            let url =`http://${req.headers.host}/shop/${files.file.name}`;
            res.json({status:'ok',url});
        })
    })
})

module.exports = router;