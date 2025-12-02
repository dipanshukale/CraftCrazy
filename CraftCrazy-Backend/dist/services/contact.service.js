"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContacts = exports.updateContactStatusService = exports.CreateContact = void 0;
const contact_mode_1 = require("../models/contact.mode");
const CreateContact = async (data) => {
    const newContact = await new contact_mode_1.Contact(data);
    await newContact.save();
};
exports.CreateContact = CreateContact;
const updateContactStatusService = async (id, status) => {
    const updated = await contact_mode_1.Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated)
        throw new Error("Contact Not Found");
};
exports.updateContactStatusService = updateContactStatusService;
const getAllContacts = async () => {
    return await contact_mode_1.Contact.find().sort({ createdAt: -1 });
};
exports.getAllContacts = getAllContacts;
