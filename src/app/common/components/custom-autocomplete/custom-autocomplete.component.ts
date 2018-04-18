import { Component, OnInit, Input, forwardRef, ViewChild, ContentChild, TemplateRef } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatInput } from '@angular/material';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'custom-autocomplete',
  templateUrl: './custom-autocomplete.component.html',
  styleUrls: ['./custom-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CustomAutocompleteComponent),
    }
  ]
})
export class CustomAutocompleteComponent implements OnInit, ControlValueAccessor {
  @ContentChild(TemplateRef)
  public ngTemplateOutlet: TemplateRef<any>;

  @ViewChild("auto")
  public autoComplete: MatAutocomplete;
  @ViewChild("matInput")
  public matInput: MatInput;

  @Input()
  public placeholder: string;

  @Input()
  public inputName: string;

  private _options: any[];
  public get options(): any[] {
    return this._options;
  }
  @Input()
  public set options(v: any[]) {
    this._options = v;
    this.filterOptions(this.filterText);
  }

  @Input()
  public disabled: boolean = false;

  @Input()
  public labelField: string = "label";

  @Input()
  public labelFunction: (item:any) => string = null;

  @Input()
  public dataField: string = "id";

  //This must be declated before it is used as the default filterFunction below
  private filterFunctionInternalImpl = (filterText:string, options:any[]) => {
    if (!options) {
      return [];
    }

    if (!filterText) {
      return options.copy();
    }

    if(this.labelFunction){
      return options
        .filter( o => {
          let label:string = this.labelFunction(o);

          if(label === null){
            return false;
          }

          return label.contains(filterText, false);
        })
    }

    return options
      .filter(o => 
        o[this.labelField] && o[this.labelField]
          .contains(filterText, false)
      );
  }

  @Input()
  public filterFunction:(filterText:string, options:any[]) => any[] = this.filterFunctionInternalImpl;

  public filteredOptions: any[];

  public filterText: string = "";

  public selectedId: string | number;

  constructor() { }

  ngOnInit() {

  }

  public getItemById(id: string | number): any {
    if (!this.options) {
      return null;
    }

    return this.options
      .find(t => t[this.dataField] == id);
  }

  public displayFunction = (id: string | number): string => {
    let item: any = this.getItemById(id);

    if (item == null) {
      return "";
    }

    if(this.labelFunction){
      return this.labelFunction(item);
    }

    return item[this.labelField];
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    this.writeValue(event.option.value);
    if (!this._onChange) {
      return;
    }
    this._onChange(event.option.value);
  }

  public filterOptions(filterText: string): void {
    this.filteredOptions = this.filterFunction(filterText, this.options);
  }

  public onBlur(): void {
    if (!this._onTouched) {
      return;
    }

    this._onTouched();
  }

  writeValue(obj: any): void {
    //Slight delay in order to ensure that anything that would otherwise be
    //written to the text input is overridden by this value.
    //TODO: figure out how to intercept whatever is writing to the text
    //input instead
    setTimeout(() => {
      this.selectedId = obj;

      let selectedOption: any = this.getItemById(this.selectedId);
      
      if (!selectedOption) {
        this.filterText = "";
        return;
      }

      if(this.labelFunction){
        this.filterText = this.labelFunction(selectedOption);
        return;
      }

      this.filterText = selectedOption[this.labelField];
    }, 0);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _onChange: Function;
  private _onTouched: Function;

}
