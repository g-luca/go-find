import { defineComponent, PropType } from "vue";

export enum SkeletonShapes {
    "Rectangle" = "rectangle",
    "Circle" = "circle"
}

export default defineComponent({
    props: {
        width: {
            type: Number,
            default: 10,
        },
        height: {
            type: Number,
            default: 10,
        },
        shape: {
            type: String as PropType<SkeletonShapes>,
            default: SkeletonShapes.Rectangle,
        },
    }
});
