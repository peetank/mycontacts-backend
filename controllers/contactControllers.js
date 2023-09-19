const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");


// @desc Get All Contacts
// @route GET /api/contacts
// @access private
const getContact = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});


// @desc Create New Contact
// @route POST /api/contacts
// @access private
const createContact = asyncHandler(async (req, res) => {
    console.log("Request Body: ", req.body);
    const { name, phone } = req.body;
    if (!name || !phone) {
        res.status(400);
        throw new Error("Name and Phone both fields are required!");
    }

    const contact = await Contact.create({
        name,
        phone,
        user_id : req.user.id
    }); 
    res.status(201).json(contact);
});


// @desc Get Individual Contact
// @route GET /api/contacts/:id
// @access private
const getIndividualContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Contact and Current user mismatch!");    
    }
    res.status(200).json(contact);
});


// @desc Update Individual Contact
// @route GET /api/contacts/:id
// @access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Contact and Current user mismatch!");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.status(200).json(updatedContact);
});


// @desc Delete Individual Contact
// @route GET /api/contacts/:id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact Not Found!");
    }

    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("Contact and Current user mismatch!");
    }

    await Contact.deleteOne(contact);
    res.status(200).json(contact);
});

module.exports = {
    getContact,
    createContact,
    getIndividualContact,
    updateContact,
    deleteContact
};