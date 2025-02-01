import { Model } from "objection";
import Blog from "./Blog";

export default class Category extends Model {
    static tableName = "categories";
    static relationMappings = () => ({
        articles: {
            relation: Model.ManyToManyRelation,
            modelClass: Blog,
            join: {
                from: "categories.id",
                through: {
                    from: "post_relations.relation_id",
                    to: "post_relations.post_id",
                    filter: { relation_type: "category" },
                },
                to: "blogs.id",
            },
        },
    });
}
