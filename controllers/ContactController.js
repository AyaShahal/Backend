import Model from "../models/ContactModel.js";


// get all the categories
export const getAll = async (req, res, next) => {
    try {
        const response = await Model.find({});
        res.status(200).send({ success: true, response });
    } catch (err) {
        return next(err);
    }
};

// get a category by id
export const get = async (req, res, next) => {
    try {
        const category = await Model.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "message not found" });
        }
        res.json(category);
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: 500, err: err.message });
    }
};

// add category
export const addmessage = async (req, res, next) => {
    try {
        console.log(req.body);
        const form = new Model({
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            phone: req.body.phone,
            email: req.body.email,
            message: req.body.message
        });

        await form.save().then((response) => {
            if (response) {
                res.status(200).send({
                    status: 200,
                    message: "Added message successfuly",
                    response,
                });
            }
        });
    } catch (err) {
        return next(err);
    }
};


  
// delete category
export const deletemessage = async (req, res) => {
    let { id } = req.params;
    try {
        const category = await Model.findByIdAndDelete({ _id: id });
     

        res.status(200).json("message deleted successfully");
    } catch (error) {
        res.json({ error: error.message });
    }
};

const Controller = {
    getAll,
    get,
    addmessage,
    deletemessage
};

export default Controller;
