// From https://github.com/github-tools/github/blob/master/lib/Requestable.js
const getNextPage = function (linksHeader) {
  const links = (linksHeader || '').split(/\s*,\s*/); // splits and strips the urls
  return links.reduce((nextUrl, link) => {
    if (link.search(/rel="next"/) !== -1) {
      return (link.match(/<(.*)>/) || [])[1];
    }

    return nextUrl;
  }, undefined);
};

const buildRepoFullName = function ({repo, defaultRepoSource}) {
  return repo.includes('/') ? repo : `${defaultRepoSource}/${repo}`;
};

const buildActionStr = function ({actionName, optionalFilter, defaultAction, savedActions}) {
  if (!actionName) {
    return defaultAction && `/${defaultAction}`;
  }

  const {action, filter: defaultFilter} = savedActions[actionName];
  const filter = optionalFilter || defaultFilter;

  if (!filter) return `/${action}`;

  return `/${action}?utf8=%E2%9C%93&q=${filter.replace(' ', '+')}`;
};

export default {
  getNextPage,
  buildRepoFullName,
  buildActionStr,
};