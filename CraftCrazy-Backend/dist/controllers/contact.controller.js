"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContact = exports.updateContactStatus = exports.addContact = void 0;
const contactService = __importStar(require("../services/contact.service"));
const initSocket_1 = require("../socket/initSocket");
const addContact = async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ success: false, message: "All required field must be provided." });
        }
        const contact = await contactService.CreateContact({ name, email, phone, message });
        (0, initSocket_1.getIO)().emit("contact-updated", contact);
        res.status(201).json({ success: true, message: "Message submitted successfully!", data: contact });
    }
    catch (error) {
        next(error);
    }
};
exports.addContact = addContact;
const updateContactStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }
        const updatedContact = await contactService.updateContactStatusService(id, status);
        (0, initSocket_1.getIO)().emit("contact-updated", { id, status });
        return res.json({
            success: true,
            message: "Contact status updated successfully",
            data: updatedContact
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateContactStatus = updateContactStatus;
const getContact = async (req, res, next) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.status(200).json({ success: true, data: contacts });
    }
    catch (error) {
        next(error);
    }
};
exports.getContact = getContact;
