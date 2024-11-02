<script lang="ts">
    import type {Snippet} from "svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
    import {buttonVariants} from "$lib/components/ui/button";
    import { AlertDialog as AlertDialogDefault, type WithoutChild } from "bits-ui";


    type Props = AlertDialogDefault.RootProps  & {
        buttonText: string;
        title: Snippet;
        description: Snippet;
        cancelButtonText?: string;
        confirmButtonText?: string;
        onacceptclick?: ()=> unknown
        contentProps?: WithoutChild<AlertDialogDefault.ContentProps>;
    };

    let {
        open = $bindable(false),
        onacceptclick,
        cancelButtonText,
        confirmButtonText,
        children,
        buttonText,
        contentProps,
        title,
        description,
        ...restProps
    }: Props = $props();
</script>


<AlertDialog.Root {...restProps} bind:open>
    <AlertDialog.Trigger class={`${buttonVariants({ variant: "default" })} ml-auto`}>
        {buttonText}
    </AlertDialog.Trigger>
    <AlertDialog.Portal>
        <AlertDialog.Overlay/>
        <AlertDialog.Content {...contentProps}>
            <AlertDialog.Header>
                <AlertDialog.Title>
                    {@render title()}
                </AlertDialog.Title>
                <AlertDialog.Description>
                    {@render description()}
                </AlertDialog.Description>
                    {@render children?.()}
            </AlertDialog.Header>
            <AlertDialog.Footer>
                <AlertDialog.Cancel>{cancelButtonText ?? 'Cancel'}</AlertDialog.Cancel>
                <AlertDialog.Action onclick={()=> onacceptclick?.()}>{confirmButtonText ?? 'Continue'}</AlertDialog.Action>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>

