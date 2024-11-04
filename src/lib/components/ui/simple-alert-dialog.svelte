<script lang="ts">
    import type {Snippet, SvelteComponent} from "svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
    import {buttonVariants} from "$lib/components/ui/button";
    import {AlertDialog as AlertDialogDefault, type WithoutChild} from "bits-ui";
    import {cn} from "$lib/utils";


    type Props = AlertDialogDefault.RootProps & {
        className?: string;
        extraButtonClasses?: string;
        buttonText: string;
        buttonIcon: Snippet;
        hiddeCancelButton?: boolean;
        dialogTitle: Snippet;
        disabledConfirmButton?: boolean;
        description: Snippet;
        cancelButtonText?: string;
        confirmButtonText?: string;
        oncancel?: () => unknown;
        onconfirm?: () => unknown;
        contentProps?: WithoutChild<AlertDialogDefault.ContentProps>;
    };

    let {
        open = $bindable(false),
        extraButtonClasses,
        buttonIcon,
        hiddeCancelButton,
        oncancel,
        onconfirm,
        cancelButtonText,
        confirmButtonText,
        class: className,
        children,
        buttonText,
        contentProps,
        title,
        disabledConfirmButton,
        dialogTitle,
        description,
        ...restProps
    }: Props = $props();

</script>


<AlertDialog.Root {...restProps} bind:open>
    <AlertDialog.Trigger class={cn(`${buttonVariants({ variant: "default" })} ml-auto`, extraButtonClasses)} {title}>
        {buttonText}
        {@render buttonIcon?.()}
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
        <AlertDialog.Overlay/>
        <AlertDialog.Content {...contentProps} class={cn(className)}>
            <AlertDialog.Header>
                <AlertDialog.Title>
                    {@render dialogTitle()}
                </AlertDialog.Title>
                <AlertDialog.Description>
                    {@render description?.()}
                </AlertDialog.Description>
                {@render children?.()}
            </AlertDialog.Header>
            <AlertDialog.Footer>
                {#if !hiddeCancelButton}
                    <AlertDialog.Cancel onclick={()=>oncancel?.()}>{cancelButtonText ?? 'Cancel'}</AlertDialog.Cancel>
                {/if}
                <AlertDialog.Action disabled={disabledConfirmButton}
                                    onclick={()=> onconfirm?.()}>{confirmButtonText ?? 'Continue'}
                </AlertDialog.Action>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>

