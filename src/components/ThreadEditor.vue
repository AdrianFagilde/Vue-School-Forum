<template>
  <VeeForm @submit="save">
    <AppFormField
      label="Title"
      name="title"
      v-model="form.title"
      rules="required"
    />
    <AppFormField
      as="textarea"
      label="Content"
      name="text"
      v-model="form.text"
      rules="required"
      rows="8"
      cols="140"
    />

    <div class="btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn-ghost">
        Cancel
      </button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? "update" : "Publish" }}
      </button>
    </div>
  </VeeForm>
</template>

<script>
export default {
  name: "ThreadEditor",
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        title: this.title,
        text: this.text,
      },
    };
  },
  methods: {
    save() {
      this.$emit("clean");
      this.$emit("save", {
        title: this.form.title,
        text: this.form.text,
      });
    },
  },
  computed: {
    existing() {
      return !!this.title;
    },
  },
  watch: {
    form: {
      handler() {
        if (this.form.title !== this.title || this.form.text !== this.text) {
          this.$emit("dirty");
        } else {
          this.$emit("clean");
        }
      },
      deep: true,
    },
  },
};
</script>
