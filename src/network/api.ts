const API = "https://blogsadmin.nivarana.org/api/"
// const API = "http:localhost:8000/api/"

export const getPost = async (id: string) => {
  const res = await fetch(API + 'singleblogdata?blog_path=' + id)
  const posts = await res.json()
  if (!posts) return undefined
  const post = posts.data[0];
  post.upload_image = "https://blogsadmin.nivarana.org/images/" + post.upload_image
  return post
}


export const addNewsLetterSubscriber = (email: string) => {
    return fetch(API + 'newsletters_add', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
        }),
    })
    .then((res) => res.json())
}


export const getPopularPosts = () => {
    return fetch(API + 'fetch_popular_post', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
}

export const getLatestPosts = () => {
    return fetch(API + 'fetch_latest_update', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
}

export const incrementBlogViewCount = (id: string) => {
        return fetch(API + 'update_blog_view', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            blog_id: id,
          }),
          cache: "no-store",
        })
          .then((response) => response.json())
          .then((json) => {
            return json['count'];
          })
      };

export const getAuthorDetails = async (id: string) => {
  const res = await fetch(API + 'fetch_author?blog_path=' + id)
  const data = await res.json();
  return data.data[0];
}


export const getPostsOfPage = async (page: string) => {
  const res = await fetch(API + 'fetch_category_post?page=' + page);
  const data = await res.json();
  return data.data.data;
}

export const getCategories = async () => {
  const res = await fetch(API + 'category');
  const data = await res.json();
  return data.data;
}

export const getCategoryPosts = async (category: string) => {
  const res = await fetch(API + 'fetch_blogs_category?category=' + category);
  const data = await res.json();
  return data;
}