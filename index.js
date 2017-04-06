let croppers = {};

class Canvas {

    /**
     * Convas constructor.
     * 
     * @param {Object} touch Element touched, can be btn or input 
     * @return {Canvas}
     */
    constructor(touch)
    {
        this.element = touch;
        this.initializedCropper = false;
        this.parent = this.$touched().closest('.row.cropper-tool');
    }

    /**
     * Check if image from canvas is valid.
     *
     * This method check if image is loaded.
     * @return {Boolean}
     */
    checkCanvasImage()
    {
        // Attempt jQuery Element. Get original element object.
        let img = this.getCanvasImage().get(0);

        if (typeof img.naturalWidth !== "undefined" 
            && img.naturalWidth === 0
        ) {
            return false;
        }

        return true;
    }

    /**
     * Set new touch element to canvas.
     *
     * @param {Object} element
     * @return {this}
     */
    setTouchElement(element)
    {
        this.element = element;
    
        return this;
    }

    /**
     * Change status of cropper to init state.
     *
     * @return {this}
     */
    changeCropperStateToInit()
    {
        this.initializedCropper = true;

        return this;
    }

    /**
     * Change cropper status to destroyed state.
     *
     * @return {this}
     */
    changeCropperStateToDestroy()
    {
        this.initializedCropper = false;
    
        return this;
    }

    /**
     * Check if cropper is inited.
     *
     * @return {Boolean}
     */
    isCropperInit()
    {
        return this.initializedCropper;
    }

    /**
     * Get touched element.
     *
     * @return {Ojbect}
     */
    touched()
    {
        return this.element;
    }

    /**
     * Get touched element wrapped jQuery.
     *
     * @return {jQuery.Ojbect}
     */
    $touched()
    {
        return $(this.element);
    }

    /**
     * Get main canvas element.
     *
     * @return {Object}
     */
    getParent()
    {
        return this.parent;
    }

    /**
     * Get element from convase by selector
     *
     * @param {jQeury.selector|String} selector
     * @return {jQuery.Object}
     */
    getCanvasElement(selector)
    {
        return this.getParent().find(selector);
    }

    /**
     * Get canvas preview image.
     *
     * @return {jQuery.Object}
     */
    getCanvasPreview()
    {
        return this.getCanvasElement('.img-preview');
    }

    /**
     * Get canvas image.
     *
     * @reutrn {jQuery.Object}
     */
    getCanvasImage()
    {
        return this.getCanvasElement('.image-crop > img.canvas-image');
    }

    /**
     * Get cropper tools.
     *
     * @return {Object}
     */
    getCropperTools()
    {
        return this.getCanvasElement('.crop-tools > button');
    }

    /**
     * Enable cropper tools.
     *
     * @return {this}
     */
    enableCropTools()
    {
        this.getCropperTools()
            .removeAttr('disabled');
    
        return this;
    }

    /**
     * Disable cropper tools.
     *
     * @return {this}
     */
    disableCropTools()
    {
        this.getCropperTools()
            .attr('disabled', 'disabled');

        return this;
    }

    /**
     * Get button by role.
     *
     * @param {String} role Button role search.
     * @return {jQuery.Object}
     */
    getBtnByRole(role)
    {
        return this.getParent().find(`[role="${role}"]`);
    }

    /**
     * Get crop image button.
     *
     * @return {jQuery.Object}
     */
    getCropBtn()
    {
        return this.getBtnByRole('crop_image');
    }

    /**
     * Get edit image button.
     *
     * @return {jQuery.Object}
     */
    getEditBtn()
    {
        return this.getBtnByRole('edit_image');
    }

    /**
     * Get upload image btn from canvas.
     *
     * @return {jQuery.Object}
     */
    getUploadBtn()
    {
        return this.getBtnByRole('upload_image');
    }

    /**
     * Get upload hidden input from canvas.
     *
     * @return {jQuery.Object}
     */
    getUploadInput()
    {
        return this.getBtnByRole('upload_input');
    }

    /**
     * Show crop button and hide edit btn instead.
     *
     * @return {this}
     */
    showCropBtn()
    {
        // this.$touched().hide();
        this.getEditBtn().hide();

        this.getCropBtn().show();

        return this;
    }

    /**
     * Show edit button and hide crop btn instead.
     *
     * @return {this}
     */
    showEditBtn()
    {
        // this.$touched().hide();
        this.getCropBtn().hide();

        this.getEditBtn().show();

        return this;
    }

    /**
     * Set new image to canvas.
     *
     * @return {this}
     */
    setCanvasImage(path)
    {
        this.getCanvasImage().attr('src', path);

        return this;
    }

    /**
     * Set cropper instance.
     *
     * @param {Cropper} cropper Cropper instance.
     * @return {this}
     */
    setCropperInsance(cropper)
    {
        this.cropper = cropper;

        return this;
    }

    /**
     * Get cropper insance.
     *
     * @return {Cropper}
     */
    getCropperInsance()
    {
        // this.cropper = this.get

        return this.getCanvasImage();

        return this.cropper;
    }

    /**
     * Destroy cropper instance for current canvas.
     *
     * @return {this}
     */
    destroyCropper()
    {
        let cropper = this.getCropperInsance();

        this.showEditBtn();

        this.disableCropTools();

        if(cropper)
        {
            this.changeCropperStateToDestroy();

            this._cropper('destroy');
        } else {
            console.log("Unable to destroy cropper, because this does not init.");
        }

        return this;
    }

    /**
     * Get cropper custom options from canvas
     *
     * @return {Object}
     */
    getCropperInitCustomOptions()
    {
        let options = this.getParent().data('cropper-init-options');

        if(typeof options == 'string')
        {
            try
            {
                return JSONfn ? JSONfn.parse(options) : JSON.parse(options);
            } catch (e) {
                console.log("Can't parse custom cropper options.");

                return {};
            }
        }

        return options;
    }

    /**
     * Get cropper required default options for init.
     *
     * @return {Object}
     */
    getCropperInitDefaultOptions()
    {
        return {
            viewMode : 3,
            aspectRatio: 1.618,
            preview: this.getCanvasPreview(),
            done: function(data) {
                console.log(data);
                // Output the result data for cropping image.
            }
        };
    }

    /**
     * Get cropper options for init.
     *
     * @return {Object}
     */
    getCropperInitOptions()
    {
        // Merge dafult options with custom above.

        let _default = this.getCropperInitDefaultOptions();
        let custom = this.getCropperInitCustomOptions();
        let options = {};

        if(typeof custom == 'object')
        {
            let defaultKeys = Object.keys(_default);
            let customKeys = Object.keys(custom);

            for(let i = 0, _count = defaultKeys.length; i < _count; i++)
            {
                options[defaultKeys[i]] = _default[defaultKeys[i]];
            }

            for(let i = 0, _count = customKeys.length; i < _count; i++)
            {
                options[customKeys[i]] = custom[customKeys[i]];
            }
        } else {
            alert('Invalid custom cropper init options! Used only default instead.');

            return _default;
        }

        return options;
    }

    /**
     * Init new cropper instance for canvas.
     *
     * @param {Boolean} verify Verify image check from canvas.
     * @return {this}
     */
    initCropper(verify = true)
    {
        if(verify && ! this.checkCanvasImage())
        {
            if(confirm("Invalid canvas image. Do you wish to upload new image?"))
            {
                this.getUploadInput().click();            
            }

            return this;
        }

        this.showCropBtn();

        this.enableCropTools();

        // $(this.getCanvasImage()).cropper()

        this._cropper(this.getCropperInitOptions());

        this.changeCropperStateToInit();

        // Image will incomping with the inner cropper.
        // use canvas.getCropperInstance().cropper() 
        // to modify cropper options.
        this.setCropperInsance(this.getCanvasImage());

        return this;
    }

    /**
     * Manipulate with cropper object of the canvas.
     *
     * @param {String} option 
     * @param {*|undefined} value 
     * @return {this}
     */
    _cropper(option, firstArg, secArg)
    {
        this.getCropperInsance().cropper(option, firstArg, secArg);

        return this;
    }
}

($ => {
    $(document).ready(() => {
        $('.crop-tools > button').on('click', (e) => {
            if(! e.target.hasAttribute("onClick"))
            {
                this['cropHandle'](e.target, 'onClickCropTool');
            }
        });
    });
 })(jQuery)

function cropHandle(element, _function)
{
    if(! this[_function])
    {
        alert(`${_function} does not exits`);
    }

    let parent = $(element).closest('.row.cropper-tool')
    let input = parent.find("input.upload-cropper-input");
    let name = $(input).attr('name');

    if(! croppers[name])
    {
        croppers[name] = new Canvas(element);
    }

    croppers[name]['setTouchElement'](element);

    return this[_function]($(element), croppers[name]);
}

function onClickEditImage($btn, canvas)
{
    let $image = canvas.getCanvasImage();

    if(! canvas.isCropperInit())
    {
        return canvas.initCropper();
    }
    
    return canvas
        .destroyCropper()
        .initCropper();
}

function onClickCropImage($btn, canvas)
{
    if(canvas.isCropperInit())
    {
        // handle crop action, send ajax etc.

        canvas.destroyCropper();

        return;
    }

    return canvas.initCropper();
}

function onUploadCropImage($input, canvas)
{
    if(canvas.isCropperInit())
    {
        canvas.destroyCropper();
    }

    let input = canvas['element'];

    if (input.files && input.files[0]) 
    {
        var reader = new FileReader();

        reader.onload = function (e)
        {
            canvas
                .setCanvasImage(e.target.result)
                .initCropper(false);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function onClickCroperCancelBtn($btn, canvas)
{
    if(canvas.isCropperInit())
    {
        canvas.destroyCropper();
    }
}

function onClickCropTool($btn, canvas)
{
    if(! canvas.isCropperInit())
    {
        canvas.initCropper();
    }

    let toolMethod = $btn.data('tool-method');
    let toolOption = $btn.data('tool-option') || void 0;

    // todo: rework it in future.
    if(typeof toolOption == 'object')
    {
        if(typeof toolOption[0] != void 0 && typeof toolOption[1] != void 0)
        {
            canvas._cropper(toolMethod, toolOption[0], toolOption[1]);
        }
    } else {
        canvas._cropper(toolMethod, toolOption);
    }
}