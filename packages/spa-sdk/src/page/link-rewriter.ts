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

import { Factory } from './factory';
import { Link, LinkType, TYPE_LINK_RESOURCE } from './link';

const BODY_CONTENTS = /^<body.*?>(.*)<\/body>$/;

export interface LinkRewriter {
  /**
   * Rewrite links to pages and resources in the HTML content.
   * @param content The HTML content to rewrite links.
   * @param type The content type.
   */
  rewrite(content: string, type?: SupportedType): string;
}

export class LinkRewriterImpl implements LinkRewriter {
  constructor(
    private linkFactory: Factory<[Link | string], string>,
    private domParser: DOMParser,
    private xmlSerializer: XMLSerializer,
  ) {}

  rewrite(content: string, type: SupportedType = 'text/html') {
    const document = this.domParser.parseFromString(content, type);

    document.querySelectorAll('a[href][data-type]').forEach(
      element => element.setAttribute('href', this.linkFactory.create({
        href: element.getAttribute('href')!,
        type: element.getAttribute('data-type') as LinkType,
      })),
    );

    document.querySelectorAll('img[src]').forEach(
      element => element.setAttribute('src', this.linkFactory.create({
        href: element.getAttribute('src')!,
        type: TYPE_LINK_RESOURCE,
      })),
    );

    const body = this.xmlSerializer.serializeToString(document.body);

    return body.replace(BODY_CONTENTS, '$1');
  }
}