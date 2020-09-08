import { getChild, getDataOrPanic } from "../helpers";

export default async ({ actions, graphql, reporter }) => {
  const data = await getDataOrPanic(
    `
          query {
            allFile(filter: {absolutePath: {}, relativePath: {in: ["permissions.mdx", "auth.mdx", "index.mdx", "requests.mdx", "pagination.mdx"]}, dir: {regex: "/api/"}}) {
              nodes {
                id
                childMarkdownRemark {
                  frontmatter {
                    title
                    description
                    draft
                    noindex
                    sidebar_order
                    redirect_from
                  }
                  fields {
                    slug
                    legacy
                  }
                  excerpt(pruneLength: 5000)
                }
                childMdx {
                  frontmatter {
                    title
                    description
                    draft
                    noindex
                    sidebar_order
                    redirect_from
                  }
                  fields {
                    slug
                    legacy
                  }
                  excerpt(pruneLength: 5000)
                }
              }
            }
          }
        `,
    graphql,
    reporter
  );

  const component = require.resolve(`../../templates/doc.tsx`);
  data.allFile.nodes.map((node: any) => {
    const child = getChild(node);
    if (child && child.fields) {
      actions.createPage({
        path: `development-api${child.fields.slug}`,
        component,
        context: {
          excerpt: child.excerpt,
          ...child.frontmatter,
          id: node.id,
          legacy: child.fields.legacy,
        },
      });
    }
  });
};