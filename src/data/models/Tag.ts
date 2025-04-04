import { Model } from "objection";
import Blog from "./Blog";

export default class Tag extends Model {
    static tableName = "tags";
    static relationMappings = () => ({
        articles: {
            relation: Model.ManyToManyRelation,
            modelClass: Blog,
            join: {
                from: "tags.id",
                through: {
                    from: "post_relations.relation_id",
                    to: "post_relations.post_id",
                    filter: { relation_type: "tag" },
                },
                to: "blogs.id",
            },
        },
    });
}
