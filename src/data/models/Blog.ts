import {  Model } from "objection";
import Author from "./Author";
import Category from "./Category";

export default class Blog extends Model {
    static tableName = "blogs";
    static relationMappings = () => ({
        authors: {
            relation: Model.ManyToManyRelation,
            modelClass: Author,
            join: {
                from: "blogs.id",
                through: {
                    from: "post_relations.post_id",
                    to: "post_relations.relation_id",
                    filter: { relation_type: "author" },
                },
                to: "authors.id",
            },
        },
        categories: {
            relation: Model.ManyToManyRelation,
            modelClass: Category,
            join: {
                from: "blogs.id",
                through: {
                    from: "post_relations.post_id",
                    to: "post_relations.relation_id",
                    filter: { relation_type: "category" },
                },
                to: "categories.id",
            },
        },
    });
    static modifiers = {
        onlyPublished(builder) {
            builder.where("status", "PUBLISHED");
        },
    };
}
