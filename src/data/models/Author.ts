import { Model } from "objection";
import Blog from "./Blog";

export default class Author extends Model {
    static tableName = "authors";
    static relationMappings = () => ({
        articles: {
            relation: Model.ManyToManyRelation,
            modelClass: Blog,
            join: {
                from: "authors.id",
                through: {
                    from: "post_relations.relation_id",
                    to: "post_relations.post_id",
                    filter: { relation_type: "author" },
                },
                to: "blogs.id",
            },
        },
    });
}
