/*
 * Copyright 2019-2020 Bloomreach
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

import { SimpleFactory } from './factory';

describe('SimpleFactory', () => {
  const factory = new (class extends SimpleFactory<string, (param: string) => string> {
    create(param: string) {
      this.mapping.forEach((builder) => builder(param));
    }
  })();

  describe('register', () => {
    it('should provide a fluent interface', () => {
      expect(factory.register('something', jest.fn())).toBe(factory);
    });

    it('should store builder in the mapping', () => {
      const builder = jest.fn();
      factory.register('something', builder);
      factory.create('something');

      expect(builder).toBeCalledWith('something');
    });
  });
});
