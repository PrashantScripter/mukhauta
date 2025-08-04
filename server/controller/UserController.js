// controllers/userController.js

const CreateUser = async (req, res) => {
  try {
    // Your logic to create a user (e.g., save to DB)
    return res.status(200).send("hello");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default CreateUser;
