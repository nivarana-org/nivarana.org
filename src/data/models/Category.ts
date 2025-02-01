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
        parent: {
            relation: Model.BelongsToOneRelation,
            modelClass: Category,
            join: {
                from: "categories.parent_id",
                to: "categories.id",
            },
        },

        children: {
            relation: Model.HasManyRelation,
            modelClass: Category,
            join: {
                from: "categories.id",
                to: "categories.parent_id",
            },
        },
    });
}
