const express = require('express')
const app = express();
const {todo} = require('./db');
const { createTodo,updateTodo } = require('./types');
const cors = require('cors')
require('dotenv').config()

app.use(express.json());
app.use(cors());


app.post('/todo',async(req,res)=>{
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);

    if (!parsedPayload.success) {
        res.status(411).json({
            msg: "You sent the wrong inputs",
        })
        return;
    }
    // put it in mongodb
    await todo.create({
        title: createPayload.title,
        description: createPayload.description,
        completed: false
    })

    res.json({
        msg: "Todo created"
    })
})

app.get('/todos',async (req,res)=>{
   
    const todos = await todo.find({});

    res.json({
        todos: todos
    })


})

app.put('/completed',async(req,res)=>{
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);
    if (!parsedPayload.success) {
        res.status(411).json({
            msg: "You sent the wrong inputs",
        })
        return;
    }

    await todo.update({
        _id: req.body.id
    }, 
    { $set: 
        { completed: true }
    },
    { new: true }
    )

    res.json({
        msg: "Todo marked as completed"
    })

})

app.delete('/delete/:todoId',async(req,res)=>{
    const todoId = req.params.todoId;
    console.log(todoId)

    try {
        const deletedTodo = await todo.deleteOne( {"_id": todoId});
    
        if (deletedTodo) {
          res.json({ message: 'Todo deleted successfully', deletedTodo });
        } else {
          res.status(404).json({ message: 'Todo not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
})

app.listen(3000);