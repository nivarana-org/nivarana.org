import { Model } from "objection";
import Author from "./Author";
import Category from "./Category";
import Tag from "./Tag";

export default class Blog extends Model {
    static tableName = "blogs";
    static get virtualAttributes() {
        return ["published_time"];
    }
    published_time() {
        if (this.scheduled_time > this.created_at) {
            return this.scheduled_time;
        }
        return this.created_at;
    }
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
                    extra: ["order"],
                },
                to: "categories.id",
            },
        },
        tags: {
            relation: Model.ManyToManyRelation,
            modelClass: Tag,
            join: {
                from: "blogs.id",
                through: {
                    from: "post_relations.post_id",
                    to: "post_relations.relation_id",
                    filter: { relation_type: "tag" },
                },
                to: "tags.id",
            },
        },
    });
    static modifiers = {
        onlyPublished(builder) {
            builder.where("status", "PUBLISHED");
        },
        orderByCreatedDesc(builder) {
            builder.orderBy("created_at", "desc");
        },
    };
}
