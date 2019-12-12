import Realm from "realm";
import User from "./User";

export default new Realm({
  schemaVersion: 11,
  schema: [
    User,
  ]
});
