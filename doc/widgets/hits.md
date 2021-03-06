## `<ng-ais-hits />`

Displays a list of hits.

You can use the directive `<ng-template></ng-template>` to customize the output:

```html
<ng-ais-hits>
  <ng-template
    let-hits="hits"
    let-results="results"
  >
    <!-- No results message -->
    <div *ngIf="hits.length === 0">
      No results found matching <strong>{{results.query}}</strong>.
    </div>

    <!-- Hit template -->
    <div *ngFor="let hit of hits">
      <h1>
        <ng-ais-highlight
          attributeName="title"
          [hit]="hit"
        >
        </ng-ais-highlight>
      </h1>

      <p>{{hit.description}}</p>
    </div>
  </ng-template>
</ng-ais-hits>
```
