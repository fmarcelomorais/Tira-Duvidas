const express = require('express');
const app = express();
// recebe dados do body front-end
const bodyParser = require('body-parser') 
// conexão com banco de dados
const connection = require('./database/database')
//imports de models
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

connection.authenticate().then(()=> console.log("Conectado com sucesso")).catch((err)=> console.log("Erro ao conectar " + err))

// chamando a View engine EJS
app.set('view engine', 'ejs'); 
app.use(express.static('public'));

//  recebe dados do body front-end
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// Rotas
app.get('/',(req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render('index', {
            perguntas: perguntas
        })
    })
    
})
app.get('/perguntar',(req, res)=>{
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res)=>{
    let titulo = req.body.titulo;
    let descricao = req.body.descricao
    //res.send("Dados do Formulario TITULO "+ titulo + " DESCRICAO: " + descricao)
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>res.redirect('/')).catch((err)=> console.log("erro ao cadastrar "+ err))
})

app.get('/pergunta/:id', (req, res)=>{
    let id = req.params.id
    Pergunta.findOne({
        where:{id: id} 
    }).then(pergunta => {
        if(pergunta != undefined){ // encontrada
            Resposta.findAll({
                where:{perguntaId: pergunta.id} ,
                order:[
                    ['id', 'DESC']
                ]         
            }).then(respostas =>{
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                })    
            })
         }else{ // não encontrada
            res.redirect('/')
         }
    })
})

app.post('/responder', (req, res)=>{
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/'+perguntaId)
    })
})

app.listen(8081, () => console.log("app rodando na porta 8081"))