import { h, Component, Prop, State, Watch } from "@stencil/core";
import { Validator, ValidatorEntry } from "./validators/validator";
import { defaultValidator, getValidator } from "./validators/validator.factory";

interface User {
  username: string;
  email: string;
  telephone: string;
  zip: string;
  gender: string;
}

enum States {
  username = 'username',
  email = 'email',
  telephone = 'telephone',
  zip = 'zip',
  gender = 'gender'
}
@Component({
  tag: "user-form",
  styleUrl: "user-form.scss",
  shadow: true
})
export class UserForm {

  @Prop() usernameValidator: Array<string | ValidatorEntry> = [{name: 'length', options: {min: 5, max: 25}}];
  @Prop() emailValidator: Array<string | ValidatorEntry> = ['email'];
  @Prop() telephoneValidator: Array<string | ValidatorEntry> = ['telephone'];
  @Prop() zipValidator: Array<string | ValidatorEntry> = ['zip'];
  @Prop() genderValidator: Array<string | ValidatorEntry> = ['select'];

  @State() userList: Array<User> = [];

  @State() username: string = "";
  @State() email: string = "";
  @State() telephone: string = "";
  @State() zip: string = "";
  @State() gender: string = "";

  @State() isSubmitted: boolean = false;

  @Watch('userList')
  watchStateHandler(newValue: Array<User>) {
    console.log(newValue);
  }

  _usernameValidator: Validator<string> = defaultValidator;
  _emailValidator: Validator<string> = defaultValidator;
  _telephoneValidator: Validator<string> = defaultValidator;
  _zipValidator: Validator<string> = defaultValidator;
  _genderValidator: Validator<string> = defaultValidator;

  isValid(data: string | Array<string>) {
    return typeof data === 'string' ?
      this[`_${data}Validator`].validate(this[data])
      : data.every((item) => this[`_${item}Validator`].validate(this[item]));
  }

  handleSubmit(e) {
    e.preventDefault()
    this.isSubmitted = true;

    if(this.isValid([...Object.values(States)])) {
      this.userList = [
        ...this.userList, 
        {
          username: this.username,
          email: this.email,
          telephone: this.telephone,
          zip: this.zip,
          gender: this.gender
        }
      ]
    }
  }

  handleChanges(e, value: string) {
    this[value] = e.target.value;
  }

  updateValidators() {
    this._usernameValidator = getValidator(this.usernameValidator);
    this._emailValidator = getValidator(this.emailValidator);
    this._telephoneValidator = getValidator(this.telephoneValidator);
    this._zipValidator = getValidator(this.zipValidator);
    this._genderValidator = getValidator(this.genderValidator);
  }

  componentWillLoad() {
    this.updateValidators();
  }

  componentWillUpdate() {
    this.updateValidators();
  }

  render() {
    return (
      <div class='container'>
        <form class='sub-container' onSubmit={(e) => this.handleSubmit(e)}>
          <div>
            <input type="text" placeholder="Username" value={this.username} onInput={(e) => this.handleChanges(e, States.username)} />
            {(this.isSubmitted && !this.isValid(States.username)) && <div class="error">{this._usernameValidator.errorMessage}</div>}
          </div>
          <div>
            <input type="email" placeholder="E-mail" value={this.email} onInput={(e) => this.handleChanges(e, States.email)} />
            {(this.isSubmitted && !this.isValid(States.email)) && <div class="error">{this._emailValidator.errorMessage}</div>}
          </div>
          <div>
            <input type="tel" placeholder="Telephone" value={this.telephone} onInput={(e) => this.handleChanges(e, States.telephone)} />
            {(this.isSubmitted && !this.isValid(States.telephone)) && <div class="error">{this._telephoneValidator.errorMessage}</div>}
          </div>
          <div>
            <input type="text" placeholder="ZIP" value={this.zip} onInput={(e) => this.handleChanges(e, States.zip)} />
            {(this.isSubmitted && !this.isValid(States.zip)) && <div class="error">{this._zipValidator.errorMessage}</div>}
          </div>
          <div class="select">
            <select name="gender" onChange={(e) => this.handleChanges(e, States.gender)}>
              <option value="" selected disabled hidden>Choose a gender...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {(this.isSubmitted && !this.isValid(States.gender)) && <div class="error">{this._genderValidator.errorMessage}</div>}
          </div>
          <input class='submit-button' type="submit" value="SUBMIT" />
        </form>
        <div class='sub-container'>
          {
            this.userList.map((user) => <div>
              {user.username}
            </div>)
          }
        </div>
      </div>
    )
  }
}