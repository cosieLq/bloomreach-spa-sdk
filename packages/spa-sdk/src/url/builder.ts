/*
 * Copyright 2019 Hippo B.V. (http://www.onehippo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const DEFAULT_API_BASE_URL = '/resourceapi';
const DEFAULT_API_URL_SUFFIX = '';
const DEFAULT_SPA_BASE_URL = '';

/**
 * Mapping of the incoming HTTP request path to the URL of the page model API.
 */
export interface UrlBuilderOptions {
  /**
   * Base URL to fetch the page model from.
   * The default URL is `cmsBaseUrl` + `/resourceapi`.
   */
  apiBaseUrl?: string;

  /**
   * Optional custom suffix for requests to the page model API.
   * The default suffix is empty string.
   */
  apiUrlSuffix?: string;

  /**
   * Base URL of the CMS.
   */
  cmsBaseUrl: string;

  /**
   * Base URL of the SPA. Everything after it will be interpreted as a route into the page model.
   * The default base url is an empty string.
   */
  spaBaseUrl?: string;
}

export interface UrlBuilder {
  /**
   * Initializes the URL Builder with options.
   * @param options The URL Builder options.
   */
  initialize(options: UrlBuilderOptions): void;

  /**
   * @param path Source path to generate the Page Model API URL.
   * @returns The Page Model API URL.
   */
  getApiUrl(path: string): string;

  /**
   * @param path Source path to the CMS resource.
   * @returns The URL to the CMS resource.
   */
  getCmsUrl(path: string): string;

  /**
   * @param path Source path to generate an SPA URL.
   * @return The SPA URL for the channel path from the source path.
   */
  getSpaUrl(path: string): string;
}

export class UrlBuilderImpl {
  private static getUrlPath(url: string) {
    if (!url) {
      return '';
    }

    // URL constructor requires either a valid URL or a base URL.
    // Since this function returns a pathname, we can safely pass a fake host to be able to resolve relative URLs.
    const { hash, pathname, search } = new URL(url, 'http://example.com');

    return `${pathname}${search}${hash}`;
  }

  private static getUrlOrigin(url: string) {
    const path = UrlBuilderImpl.getUrlPath(url);

    return path && url.endsWith(path)
      ? url.substring(0, url.length - path.length)
      : url;
  }

  private static appendQuery(url: string, query: string) {
    if (!query) {
      return url;
    }

    return `${url}${url.includes('?') ? '&' : '?'}${query}`;
  }

  private options: UrlBuilderOptions = { cmsBaseUrl: '' };

  initialize(options: UrlBuilderOptions) {
    this.options = options;
  }

  getApiUrl(path: string) {
    const [pathname, query = ''] = path.split('?', 2);
    const {
      cmsBaseUrl,
      apiBaseUrl = `${cmsBaseUrl}${DEFAULT_API_BASE_URL}`,
      apiUrlSuffix = DEFAULT_API_URL_SUFFIX,
      spaBaseUrl = DEFAULT_SPA_BASE_URL,
    } = this.options;
    const base = UrlBuilderImpl.getUrlPath(spaBaseUrl);
    if (base && !pathname.startsWith(base)) {
      throw new Error(`The path "${path}" does not start with the base path "${base}".`);
    }

    const route = pathname.substring(base.length);

    return UrlBuilderImpl.appendQuery(`${apiBaseUrl}${route}${apiUrlSuffix}`, query);
  }

  getCmsUrl(link: string) {
    const origin = UrlBuilderImpl.getUrlOrigin(this.options.cmsBaseUrl);

    return `${origin}${link && UrlBuilderImpl.getUrlPath(link)}`;
  }

  getSpaUrl(link: string) {
    const { cmsBaseUrl, spaBaseUrl = DEFAULT_SPA_BASE_URL } = this.options;
    const base = UrlBuilderImpl.getUrlPath(cmsBaseUrl);
    const path = link && UrlBuilderImpl.getUrlPath(link);
    const route = base && path.startsWith(base)
      ? path.substring(base.length)
      : path;

    return `${spaBaseUrl}${!route.startsWith('/') && !spaBaseUrl ? '/' : ''}${route}`;
  }
}