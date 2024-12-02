const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User, Account, todo, Product } = require('../models');
const auth = require("../middleware/auth");
const { QueryTypes, Op } = require('sequelize');

/**
 * @swagger
 * /getUser/{id}:
 *   get:
 *     summary: Get User by ID
 *     description: Retrieve user data by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       400:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */

router.get('/getUser/:id', [auth], async function(req, res) {
    try {
        const userData = await User.findOne({
            where: {
                id: Number(req.params.id)
            },
            attributes: ['id','first_name', 'last_name', 'email', 'phone'],
            include: [
                {
                    model: todo,
                    attributes: ['id', 'text']
                }
            ]
        });
        if (!userData) {
            return res.status(400).json('No data found..');
        }
        res.json(userData);
    } catch (error) {
        res.status(400).json(error.message);
    }
})

/**
 * @swagger
 * /createUser:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Error creating user
 *       500:
 *         description: Internal server error
 */
router.post('/createUser', [auth], async function(req, res) {
    try {
        const model = req.body;
        const userData = await User.create({
            first_name: model.first_name,
            last_name: model.last_name,
            email: model.email,
            phone: model.phone,
            password: model.password
        })
        res.json(userData.toJSON());
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

/**
 * @swagger
 * /updateUser/{id}:
 *   post:
 *     summary: Update a user
 *     description: Update a user with the provided data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Error updating user
 *       500:
 *         description: Internal server error
 */
router.post('/updateUser/:id', [auth], async function(req, res) {
    try {
        const model = req.body;
        const userData = await User.update({
            first_name: model.first_name,
            last_name: model.last_name,
            email: model.email,
            phone: model.phone
        }, { where:{id: req.params.id }})
        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(400).json(error.message);
    }
})

/**
 * @swagger
 * /createTodo:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo created successfully
 *       400:
 *         description: Error creating todo
 *       500:
 *         description: Internal server error
 */
router.post('/createTodo', async function(req, res) {
    try {
        const model = req.body;
        const todoData = await todo.create({
            user_id: Number(model.user_id),
            text: model.text
        })
        res.json(todoData.toJSON());
    } catch (error) {
        res.status(400).json(error);
    }
})

/**
 * @swagger
 * /getTodo/{id}:
 *   get:
 *     summary: Get todo by ID
 *     description: Retrieve todo data by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo data retrieved successfully
 *       400:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */
router.get('/getTodo/:id', async function(req, res) {
    try {
        const todoData = await todo.findOne({
            where: {
                id: Number(req.params.id)
            },
            attributes: ['id','text', 'user_id'],
            include: [
                {
                    model: User,
                    attributes: ['id','first_name', 'last_name', 'email', 'phone']
                }
            ]
        });
        if (!todoData) {
            return res.json('No data found..');
        }
        res.json(todoData.toJSON());
    } catch (error) {
        res.status(400).json(error.message);
    }
})

/**
 * @swagger
 * /allUser:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all user data with their dependent todo list
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       400:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */
router.get('/allUser', [auth], async function(req, res) {
    try {
        // Here we can find all user with its dependent todo list of user
        /*const userData = await User.findAndCountAll({
            attributes: ['id','first_name', 'last_name', 'full_name', 'email', 'phone'],
            include: [
                {
                    model: todo,
                    attributes: ['id', 'text']
                }
            ],
            offset: 0,
            limit: 10,
            order: [
                ['id', 'desc']
            ]
        }); */
        const userData = await User.sequelize.query(
            "WITH RECURSIVE subordinates AS (SELECT employee_id, manager_id, full_name FROM employees WHERE employee_id = :emp_id UNION SELECT e.employee_id, e.manager_id, e.full_name FROM employees e INNER JOIN subordinates s ON s.employee_id = e.manager_id) SELECT * FROM subordinates",
            {   raw: true,
                replacements: { emp_id: 2 },
                type: QueryTypes.SELECT
            }
        );
        // Here we can run the procedure to update the amount of user using below definition
        /*

            begin
                -- subtracting the amount from the sender's account 
                update accounts 
                set balance = balance - amount 
                where id = sender;

                -- adding the amount to the receiver's account
                update accounts 
                set balance = balance + amount 
                where id = receiver;

                commit;
            end;
        */
        /*const userData = await Account.sequelize.query("CALL transfer(:sender, :receiver, :amount);",
            {   
                replacements: { sender: 1, receiver: 2, amount: 1000, },
                type: QueryTypes.SELECT,
                raw: true
            }
        ) */
        if (!userData) {
            return res.status(400).json('No data found..');
        }
        else {
            const userData2 = await Account.findAndCountAll({
                attributes: ['id','name', 'balance'],
            });
            res.json({result : userData2});
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
})

/** 
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Error registering user
 *       500:
 *         description: Internal server error
 */
router.post("/register", async (req, res) => {
    const t = await User.sequelize.transaction();
    try {
      const { first_name, last_name, email, phone, password } = req.body;
      if (!(email && password && first_name && last_name)) {
        res.status(400).send("All input is required");
      }

      const oldUser = await User.findOne({
        where: {
            email:email
        }
        });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      encryptedPassword = await bcrypt.hash(password, 10);
  
        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            phone,
            password: encryptedPassword,
        }, { transaction: t });
        await t.commit();
        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
            expiresIn: "12h",
            }
        );
        // save user token
        user.token = token;
    
        res.status(201).json(user);
    } catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(400).send("Someting went wrong, please try again..");
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and generate a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", async (req, res) => {

    try {
      const { email, password } = req.body;
  
      if (!(email && password)) {
        res.status(400).send({message:"All input is required"});
      }
      const user = await User.findOne({ 
            where: {
                email:email
            } 
        });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );
  
        // save user token
        user.token = token;
        userData = {
            token: user.token,
            isLoggedIn: true
        }
        res.status(200).json(userData);
      }
      res.status(400).send({message: 'Invalid Credentials..'});
    } catch (err) {
      console.log(err);
    }
});

/**
 * @swagger
 * /deleteUser/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: No data found or error deleting user
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteUser/:id', [auth], async function(req, res) {
    try {
        const userData = await User.findOne({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!userData) {
            return res.status(400).json('No data found..');
        } else {
            const user = await User.destroy({
                where: {
                    id: Number(req.params.id)
                }
            });
            if(user) {
                return res.status(200).json({message: 'User data deleted successfully..'});
            } else {
                return res.status(400).json({message: 'User data not deleted..'});
            }
            
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
})

/**
 * @swagger
 * /createProducts:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               properties:
 *                 type: object
 *                 properties:
 *                   size:
 *                     type: array
 *                     items:
 *                       type: string
 *                   color:
 *                     type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Error creating product
 *       500:
 *         description: Internal server error
 */
router.post('/createProducts', async function(req, res) {
    try {
        const model = req.body;
        const todoData = await Product.create({
            name: model.name,
            properties: model.properties
        })
        res.json(todoData.toJSON());
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
})

/** 
 * @swagger
 * /getAllProducts:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all product data
 *     responses:
 *       200:
 *         description: Product data retrieved successfully
 *       400:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */
router.get('/getAllProducts', async function(req, res) {
    try {
        const todoData = await Product.findAll({
            offset: 0,
            limit: 10,
            order: [
                ['created_at', 'desc']
            ]
        })
        res.json({result: todoData});
    } catch (error) {
        console.log(error)
        res.status(400).json(error);
    }
})

/**
 * @swagger
 * /getProductWithJsonField:
 *   get:
 *     summary: Get products with JSON field
 *     description: Retrieve products with a specific JSON field value
 *     parameters:
 *       - in: query
 *         name: size
 *         description: Size of the product
 *         schema:
 *           type: string
 *       - in: query
 *         name: color
 *         description: Color of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data retrieved successfully
 *       400:
 *         description: No data found
 *       500:
 *         description: Internal server error
 */
router.get('/getProductWithJsonField', async function(req, res) {
    try {
        let size = req.query.size || 'M';
        let color = req.query.color || 'pink';
        const userData = await Product.findAll(
            {   
                attributes: ['id','name', 'properties'],  
                where: {
                    'properties.color': {
                        [Op.eq]: color
                    },
                    'properties': {
                        [Op.contains]: {size: [size]}
                    }
                },
                raw: true
            }
        )
        if (!userData) {
            return res.status(400).json('No data found..');
        }
        else {
            res.json({result : userData});
        }
    } catch (error) {
        res.status(400).json(error.message);
    }
})
module.exports = router;