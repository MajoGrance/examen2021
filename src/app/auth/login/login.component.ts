import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    /**
     * Formulario con el nombre de usuario y la contraseña del usuario que
     * esta intentando loguearse.
     */
    formGroup: FormGroup = this.fb.group({
        usuario: ['', Validators.required],
        contrasenha: ['', Validators.required],
    });
    /**
     * Visibilidad del campo contraseña, en password se encuentra oculto y
     * en text se encuentra visible.
     */
    keyType: 'password' | 'text' = 'password';
    /**
     * Indicador de que se ha ingresado un usuario inválido.
     */
    loginError = '';
    /**
     * Indicador de que se ha podido verificar que el usuario existe y
     * se realizó el logueo correctamente.
     */
    logged = false;
    /**
     * Ancho de la pantalla en pixeles.
     */
    innerWidth = window.innerWidth;
    /**
     * Indicador de carga.
     */
    loading = false;
    /**
     * Indicador de que la vista ya se inicializó y comienza la animación.
     */
    init = false;

    /**
     * Escucha el evento de reajuste del tamaño de la pantalla del dispositivo
     * y actualiza el ancho de la pantalla. 
     */
    @HostListener('window:resize')
    onResize() {
        this.innerWidth = window.innerWidth;
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) { }
  
    ngOnInit(): void { }

    ngAfterViewInit(): void {
        setTimeout(()=> {
            this.init = true;
        })
    }

    /**
     * Modifica el valor de la visibilidad del campo contraseña, si se encuentra oculto (password), lo
     * vuelve visible (text) y viceversa.
     */
    toggleKeyType(): void {
        if (this.keyType === 'password') {
            this.keyType = 'text';
        } else {
            this.keyType = 'password';
        }
    }

    /**
     * Marca todos los campos del formulario como tocados, de modo a que se muestren los errores de
     * campos si el formulario no es válido. En caso de que el formulario sea válido, se realiza el login, si
     * el login se realiza exitosamente se redirecciona a la página de inicio del sistema, en caso contrario
     * se muestra el error correspondiente.
     */
    async login(): Promise<void> {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            this.loading = true;
            const resp = await this.authService.login(this.formGroup.getRawValue());
            if (resp.ok) {
                this.loginError = '';
                this.logged = true
                await this.router.navigate(['/sitio/dashboard']);
            } else {
                this.loginError = resp.msg;
            }
            this.loading = false;
        }
    }
}
