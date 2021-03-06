import { Component, Input, Inject, forwardRef } from "@angular/core";

import { connectMenu } from "instantsearch.js/es/connectors";
import { noop, isFunction } from "lodash-es";

import { BaseWidget } from "../base-widget";
import { NgAisInstantSearch } from "../instantsearch/instantsearch";
import { parseNumberInput } from "../utils";

export type MenuState = {
  canRefine: boolean;
  canToggleShowMore: boolean;
  createURL: Function;
  isShowingMore: boolean;
  items: {}[];
  refine: Function;
  toggleShowMore: Function;
};

@Component({
  selector: "ng-ais-menu",
  template: `
    <div
      [class]="cx()"
      *ngIf="!isHidden"
    >
      <ul [class]="cx('list')">
        <li
          [class]="getItemClass(item)"
          *ngFor="let item of items"
          (click)="handleClick($event, item.value)"
        >
          <a
            href="{{state.createURL(item.value)}}"
            [class]="cx('link')"
            (click)="handleClick($event, item.value)"
          >
            <span [class]="cx('label')">{{item.label}}</span>
            <span [class]="cx('count')">{{item.count}}</span>
          </a>
        </li>
      </ul>

      <button
        *ngIf="showMoreLimit && state.canToggleShowMore"
        (click)="state.toggleShowMore()"
        [class]="showMoreClass"
      >
        {{state.isShowingMore ? showLessLabel : showMoreLabel}}
      </button>
    </div>
  `
})
export class NgAisMenu extends BaseWidget {
  // render options
  @Input() public showMoreLabel: string = "Show more";
  @Input() public showLessLabel: string = "Show less";
  @Input() public transformItems?: Function;

  // connector options
  @Input() public attribute: string;
  @Input() public limit?: number | string = 10;
  @Input() public showMoreLimit?: number | string;
  @Input() public sortBy?: string[] | ((item: object) => number);

  public state: MenuState = {
    canRefine: false,
    canToggleShowMore: false,
    createURL: noop,
    isShowingMore: false,
    items: [],
    refine: noop,
    toggleShowMore: noop
  };

  get isHidden() {
    return this.state.items.length === 0 && this.autoHideContainer;
  }

  get showMoreClass() {
    let className = this.cx("showMore");

    if (!this.state.canToggleShowMore) {
      className = `${className} ${this.cx("showMore", "disabled")}`;
    }

    return className;
  }

  get items() {
    return isFunction(this.transformItems)
      ? this.transformItems(this.state.items)
      : this.state.items;
  }

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent: any
  ) {
    super("Menu");
  }

  public ngOnInit() {
    this.createWidget(connectMenu, {
      limit: parseNumberInput(this.limit),
      showMoreLimit: parseNumberInput(this.showMoreLimit),
      attributeName: this.attribute,
      sortBy: this.sortBy
    });

    super.ngOnInit();
  }

  handleClick(event: MouseEvent, value: string) {
    event.preventDefault();
    event.stopPropagation();

    this.state.refine(value);
  }
}
