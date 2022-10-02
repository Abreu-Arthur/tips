const express=require('express')
const handlebars=require('express-handlebars')
const bp=require('body-parser')
const app=express()
const mongoose=require('mongoose')
const session=require('express-session')
const cookieParser=require('cookie-parser')
const flash=require('connect-flash')

//session
app.use(cookieParser())
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:'Jhon'
}))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.id_msg=req.flash('id_msg')
    next()
})
//models
require('./models/todos')
const Todo=mongoose.model('todos')
require('./models/user')
const User=mongoose.model('users')
require('./models/playlist')
const PlayList=mongoose.model('playlists')
require('./models/coment')
const Coment=mongoose.model('coments')
require('./models/item')
const Item=mongoose.model('itens')

//Mongoose
mongoose.connect('mongodb://localhost/tipes').then(()=>{
    console.log('CONNECTED TO MONGO WITH SUCCESS')
}).catch((e)=>{
    console.log('ERROR TO CONNECT TO MONGO '+e)
})
//NPMS
app.use('handlebars',handlebars.engine({
    defaultLayout:'main',
    runTimeOptions:{
        allowProtoPropertiesByDefault:true,
        allowProtoMethodsByDefault:true
    }
}))
app.set('view engine','handlebars')
app.engine('handlebars',handlebars.engine())

app.use(bp.urlencoded({
    extended:true
}))
app.use(express.json())

//ROUTES
app.get('/',(req,res)=>{
    var dt=new Date()
    var dia=dt.getDate()
    Todo.find({username:req.session.user.username}).lean().then(()=>{
        Todo.find({dia:dia}).lean().then((todos)=>{
            res.render('./admin/index',{todos:todos})   
        })   
    }).catch((e)=>{
        console.log('USER OR TODO DOES NOT EXISTE '+e)
    })
})
app.get('/create',(req,res)=>{
    res.render('./admin/create')
})
app.post('/created',(req,res)=>{
    var dt=new Date()
    const todo={
        username:req.session.user.username,
        todo:req.body.todo,
        imp:req.body.imp,
        dia:req.body.dia,
        hora:req.body.hora
    }
    new Todo(todo).save().then(()=>{
        console.log('TODO  CREATED WITH SUCCESS')
        res.redirect('/')
    }).catch((e)=>{
        console.log('ERROR TO CREATE NEW TODO'+e)
        res.redirect('/create')
    })
})
app.get('/createaccount',(req,res)=>{
    res.render('./admin/createuser')
})
app.post('/usercreated',(req,res)=>{
    const user={
        nome:req.body.nome,
        username:req.body.username,
        email:req.body.username,
        senha:req.body.senha     
    }
    req.session.user=user
    req.session.save()
    new User(user).save().then(()=>{
        console.log('USER CREATED WITH SUCCESS')
        res.redirect('/')
    }).catch((e)=>{
        console.log('ERROR TO CREATE NEW USER '+e)
        res.redirect('/createaccount')
    })
})
app.get('/login',(req,res)=>{
    res.render('./admin/login')
})
app.post('/loged',(req,res)=>{
    User.findOne({nome:req.body.nome}).then((user)=>{
        if((user.username==req.body.username) && (user.email==req.body.email) && (user.senha==req.body.senha)){
            console.log('USER LOGGED IN WITH SUCCESS')
            req.session.user=user
            res.redirect('/')
        }else{
            console.log('ERROR TO LOGIN ')
            res.redirect('/login')
        }
        console.log(user)
    }).catch((e)=>{
        console.log('USER NOT FOUND '+e)
        res.redirect('/')
    })
})
app.get('/user',(req,res)=>{
    res.render('./admin/user',{user:req.session.user})
})
app.post('/checked',(req,res)=>{
    Todo.deleteOne({_id:req.body.id}).then(()=>{
        console.log('Deleted with success')
        res.redirect('/')
    }).catch((e)=>{
        console.log('ERROR TO  DELETE THIS TODO '+e)
    })
})
app.get('/edit/:id',(req,res)=>{
    Todo.findOne({_id:req.params.id}).lean().then((todo)=>{
        res.render('./admin/edit',{todo:todo})
    }).catch((e)=>{
        console.log('ERROR TO LOOK UP TODO '+e)
    })
})
app.post('/edited',(req,res)=>{
    Todo.findOne({_id:req.body.id}).then((todo)=>{
        todo.todo=req.body.todo,
        todo.imp=req.body.imp,
        todo.dia=req.body.dia,
        todo.hora=req.body.hora
        todo.save().then(()=>{
            console.log('UPDATED WITH SUCCESS')
            res.redirect('/')
        }).catch((e)=>{
            console.log('ERROR TO UPDATE THE TODO '+e)
        })
    })
})
app.get('/newplaylist',(req,res)=>{
    res.render('./admin/newplaylist')
})
app.post('/playlisted',(req,res)=>{
    const newplaylist={
        nome:req.body.nome,
        desc:req.body.desc,
        usercreator:req.session.user.username
    }
    new PlayList(newplaylist).save().then(()=>{
        console.log('Playlist created with success')
        res.redirect('/')
    }).catch((e)=>{
        console.log('ERROR TO CREATE NEW PLAYLIST '+e)
        res.redirect('/newplaylist')
    })
})
app.get('/coment/:id',(req,res)=>{
    Todo.find({_id:req.params.id}).lean().then((todo)=>{
        res.render('./admin/coment',{todo:todo})
    })
})
app.post('/comented',(req,res)=>{
    const coment={
        id:req.body.id,
        coment:req.body.coment
    }
    new Coment(coment).save().then(()=>{
        console.log('COMENTED WITH SUCCESS')
        res.redirect('/')
    }).catch((e)=>{
        console.log('ERROR TO COMENT '+e)
        res.redirect('/')
    })
})
app.get('/ccoments/:id',(req,res)=>{
    Coment.find({id:req.params.id}).lean().then((coments)=>{
        res.render('./admin/ccoments',{coments:coments})
    })
})
app.get('/myplaylists',(req,res)=>{
    PlayList.find({usercreator:req.session.user.username}).lean().then((playlists)=>{
        res.render('./admin/viewplaylists',{playlists:playlists})
    }).catch((e)=>{
        console.log('NO PLAYLISTS FOUND '+e)
        res.redirect('/newplaylist')
    })
})
app.get('/newitem/:id',(req,res)=>{
    PlayList.find({_id:req.params.id}).lean().then((playlist)=>{
        res.render('./admin/newitem',{playlist:playlist})
    }).catch((e)=>{
        console.log('NO PLAYLIST FOUNDED '+e)
    })
})
app.post('/itemcreated',(req,res)=>{
    const newitem={
        id:req.body.id,
        username:req.session.user.username,
        item:req.body.item,
        imp:req.body.imp,
        dia:req.body.dia,
        hora:req.body.hora
    }
    new Item(newitem).save().then(()=>{
        console.log('ITTEM CREATED WITH SUCCESS')
        res.redirect('/myplaylists')
    }).catch((e)=>{
        console.log('ERROR TO CREATE THIS NEW ITEM '+e)
        res.redirect('/')
    })
})
app.get('/itens/:id',(req,res)=>{
    Item.find({id:req.params.id}).lean().then((itens)=>{
        res.render('./admin/seeitens',{itens:itens})
    }).catch((e)=>{
        console.log('ERROR TO SEE THE ITENS '+e)
    })
})
app.post('/checkediten',(req,res)=>{
    Item.deleteOne({_id:req.body.id}).then(()=>{
        console.log('Iten deleted with success')
        res.redirect('/myplaylists')
    }).catch((e)=>{
        console.log('ERROR TO DELETE THIS ITEM '+e)
        res.redirect('/')
    })
})
//SERVER
var DOOR=7000
app.listen(DOOR,()=>{
    console.log(`SERVER RUNNING IN THE ${DOOR} DOOR`)
})