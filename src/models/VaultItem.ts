import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVaultItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  username: string;
  passwordCipher: string;
  url?: string;
  notesCipher?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  passwordCipher: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  notesCipher: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

VaultItemSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const VaultItem: Model<IVaultItem> =
  mongoose.models.VaultItem ||
  mongoose.model<IVaultItem>("VaultItem", VaultItemSchema);

export default VaultItem;
