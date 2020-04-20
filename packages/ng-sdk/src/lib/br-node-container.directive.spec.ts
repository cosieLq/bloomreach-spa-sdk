/*
 * Copyright 2020 Hippo B.V. (http://www.onehippo.com)
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

import { Component, Input, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Container, TYPE_CONTAINER_BOX } from '@bloomreach/spa-sdk';
import { BrNodeContainerDirective } from './br-node-container.directive';
import { BrNodeDirective } from './br-node.directive';
import { BrPageComponent } from './br-page/br-page.component';

@Component({
  selector: 'br-container-test',
  template: `<a></a>`,
})
class ContainerTestComponent {}

@NgModule({
  declarations: [ContainerTestComponent],
  entryComponents: [ContainerTestComponent],
})
class TestModule {}

@Component({ template: '<ng-container [brNodeContainer]="container"></ng-container>' })
class TestComponent {
  @Input() container!: Container;
}

describe('BrNodeContainerDirective', () => {
  let container: Container;
  let node: BrNodeDirective;
  let page: BrPageComponent;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    container = {
      getType: () => TYPE_CONTAINER_BOX,
      getMeta: () => ({
        clear: jest.fn(),
        render: jest.fn(),
      }),
    } as unknown as typeof container;
    node = {} as typeof node;
    page = { mapping: {} } as typeof page;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponent, BrNodeDirective, BrNodeContainerDirective ],
      imports: [ TestModule ],
      providers: [
        { provide: BrNodeDirective, useFactory: () => node },
        { provide: BrPageComponent, useFactory: () => page },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.container = container;
  });

  describe('getMapping', () => {
    it('should render a mapped container', () => {
      page.mapping[TYPE_CONTAINER_BOX] = ContainerTestComponent;
      fixture.detectChanges();

      expect(fixture.nativeElement).toMatchSnapshot();
    });
  });
});
