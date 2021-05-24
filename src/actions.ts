import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { Users } from './entities/Users'
import { Exception } from './utils'
import { Todos } from './entities/Todos';
import { ok } from 'assert';

export const createUser = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.first_name) throw new Exception("Please provide a first_name")
    if (!req.body.last_name) throw new Exception("Please provide a last_name")
    if (!req.body.email) throw new Exception("Please provide an email")
    if (!req.body.password) throw new Exception("Please provide a password")

    const userRepo = getRepository(Users)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { email: req.body.email } })
    if (user) throw new Exception("Users already exists with this email")

    const newUser = getRepository(Users).create(req.body);  //Creo un usuario
    const results = await getRepository(Users).save(newUser); //Grabo el nuevo usuario 
    const userCreated = await getRepository(Users).findOne(req.params.user_id)
    if (!userCreated) throw new Exception("El usuario no existe")

    const todo = new Todos();
    todo.label = "Ejemplo";
    todo.done = false;
    todo.user = userCreated;

    const result = await getRepository(Todos).save(todo);
    return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(Users).find();
    return res.json(users);
}


export const getTodos = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(Users).findOne(req.params.user_id, { relations: ["todos"] });
    if (!users) {
        return res.json({ "message": "Not found" });
    }
    return res.json(users.todos);
}

export const postTodos = async (req: Request, res: Response): Promise<Response> => {
    console.log("entré")
    if (!req.body.label) throw new Exception("Please provide a label")
    if (!req.body.done) throw new Exception("Please provide a state")

    const todoList = getRepository(Todos)
    const newTodoValidation = await todoList.findOne({ where: { label: req.body.label, user: req.body.user } });
    if (newTodoValidation) throw new Exception("The todo already exists");

    const users = await getRepository(Users).findOne(req.params.user_id);
    if (!users) throw new Exception("The user is not found");

    const newTodo = getRepository(Todos).create({ ...req.body, user: users });
    const results = await getRepository(Todos).save(newTodo);

    return res.json(results);
}




export const getUserId = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(Users).findOne(req.params.user_id);
    if (!users) throw new Exception("The user is not found");

    const results = await getRepository(Users).save(users);
    return res.json(results);
}




export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(Users).findOne(req.params.user_id);
    if (!users) {
        return res.json({ "message": "User not found" })
    } else {

        const results = await getRepository(Users).delete(users);
        return res.json(results);
    }

}

